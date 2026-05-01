package dev.prince.movieez.security.configs;

import dev.prince.movieez.security.authentik.AuthentikUserSyncFilter;
import dev.prince.movieez.security.ratelimit.RateLimiterFilterImpl;
import dev.prince.movieez.security.ratelimit.RateLimiterServiceImpl;
import dev.prince.movieez.security.repositories.UserRepository;
import dev.prince.movieez.users.UserRole;
import java.util.Collection;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Slf4j
@Configuration
@EnableWebSecurity
public class SecurityConfigs {

  @Value("${app.allowed-origins}")
  private List<String> allowedOrigins;

  @Value("${app.allowed-origins-pattern}")
  private List<String> allowedOriginsPattern;

  @Bean
  public SecurityFilterChain commonConfigs(HttpSecurity httpSecurity, RateLimiterServiceImpl rateLimiterService) {
    return httpSecurity
        .securityMatcher("/**")
        .cors(cors -> {
          cors.configurationSource(corsConfigurationSource());
        })
        .addFilterBefore(new RateLimiterFilterImpl(rateLimiterService), AuthorizationFilter.class)
        .build();
  }

  @Bean
  @Order(1)
  public SecurityFilterChain mediaConfigs(HttpSecurity httpSecurity) {
    return httpSecurity
        .securityMatcher("/media/**")
        .authorizeHttpRequests(auth -> {
          auth
              .anyRequest()
              .permitAll();
        })
        .build();
  }

  @Bean
  @Order(2)
  public SecurityFilterChain userConfigs(HttpSecurity httpSecurity, UserRepository userRepository) {
    return httpSecurity
        .securityMatcher("/users/**")
        .authorizeHttpRequests(auth -> {
          auth
              .anyRequest()
              .authenticated();
        })
        .oauth2ResourceServer(oauth2 -> {
          oauth2.jwt(jwtConfigurer -> {
            jwtConfigurer.jwtAuthenticationConverter(jwtAuthenticationConverter());
          });
        })
        .addFilterAfter(new AuthentikUserSyncFilter(userRepository), AuthorizationFilter.class)
        .build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    log.info("Configuring CORS with allowed origins: {}", String.join(", ", allowedOrigins));
    log.info("Configuring CORS with allowed origin patterns: {}", String.join(", ", allowedOriginsPattern));

    var defaultOption = new CorsConfiguration();
    defaultOption.setAllowedOrigins(allowedOrigins);
    defaultOption.setAllowedMethods(List.of("GET", "POST", "DELETE", "OPTIONS"));
    defaultOption.setAllowedHeaders(List.of("*"));
    defaultOption.setAllowedOriginPatterns(allowedOriginsPattern);
    defaultOption.setAllowCredentials(false);

    var userOption = new CorsConfiguration();
    userOption.setAllowedOrigins(allowedOrigins);
    userOption.setAllowedOriginPatterns(allowedOriginsPattern);
    userOption.setAllowedMethods(List.of("GET", "POST", "DELETE", "OPTIONS"));
    userOption.setAllowedHeaders(List.of("*"));
    userOption.setAllowCredentials(true);

    var source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/users/**", userOption);
    source.registerCorsConfiguration("/media/**", defaultOption);
    source.registerCorsConfiguration("/**", defaultOption);

    return source;
  }

  @Bean
  public JwtAuthenticationConverter jwtAuthenticationConverter() {
    var converter = new JwtAuthenticationConverter();
    converter.setJwtGrantedAuthoritiesConverter(new AuthentikGrantedAuthoritiesConverter());
    return converter;
  }

  private static class AuthentikGrantedAuthoritiesConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    @Override
    public Collection<GrantedAuthority> convert(@NonNull Jwt source) {

      var groups = source.getClaim("groups");

      if (groups instanceof Collection<?> roles) {
        return roles
            .stream()
            .map(Object::toString)
            .map(String::trim)
            .filter(role -> !role.isBlank() && (role.contains("ADMIN") || role.contains("USER")))
            .map(role -> {
              return UserRole
                  .fromRole("ROLE_" + role
                      .substring(role.indexOf('.') + 1)
                      .toUpperCase())
                  .name();
            })
            .map(SimpleGrantedAuthority::new)
            .map(GrantedAuthority.class::cast)
            .toList();
      }

      return List.of(new SimpleGrantedAuthority("ROLE_" + UserRole.GUEST.name()));
    }
  }
}
