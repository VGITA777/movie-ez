package dev.prince.movieez.security.configs;

import dev.prince.movieez.security.filters.CustomSecurityHeaderFilter;
import dev.prince.movieez.security.authentik.AuthentikUserSyncFilter;
import dev.prince.movieez.security.ratelimit.RateLimiterFilter;
import dev.prince.movieez.security.ratelimit.RateLimiterFilterImpl;
import dev.prince.movieez.security.ratelimit.RateLimiterService;
import dev.prince.movieez.shared.models.responses.ServerAuthenticationResponse;
import dev.prince.movieez.shared.utilities.BasicUtils;
import dev.prince.movieez.user.repository.MovieEzUserRepository;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.ExceptionHandlingConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;
import org.springframework.web.bind.annotation.CrossOrigin;
import tools.jackson.databind.ObjectMapper;

@Configuration
@EnableWebSecurity
@CrossOrigin(allowedHeaders = "*", origins = "*")
public class SecurityConfigs {

  @Value("${app.movieez.security.header:#{null}}")
  private String mediaSecurityHeader;

  @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
  private String issuerUri;

  @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
  private String jwkSetUri;

  @Value("${app.authentik.client-id}")
  private String authentikClientId;

  /**
   * Security filter chain for the /user/** endpoint.
   */
  @Bean
  @Order(1)
  public SecurityFilterChain userSecurityFilterChain(
      HttpSecurity http,
      ObjectMapper objectMapper,
      RateLimiterFilter rateLimiterFilter,
      MovieEzUserRepository movieEzUserRepository
  ) throws Exception {
    return applyCommonSecuritySettings(http, rateLimiterFilter)
        .securityMatcher("/user/**")
        .oauth2ResourceServer(e -> {
          e.jwt(jwtConfigurer -> {
            jwtConfigurer.jwtAuthenticationConverter(jwtAuthenticationConverter());
          });
        })
        .exceptionHandling(ex -> configureUserExceptionHandling(ex, objectMapper))
        .authorizeHttpRequests(endpoints -> {
          endpoints
              .anyRequest()
              .authenticated();
        })
        .addFilterBefore(new AuthentikUserSyncFilter(movieEzUserRepository), AuthorizationFilter.class)
        .build();
  }

  /**
   * Security filter chain for the /media/** endpoint.
   */
  @Bean
  public SecurityFilterChain mediaSecurityFilterChain(
      HttpSecurity http,
      BasicUtils basicUtils,
      RateLimiterFilter rateLimiterFilter
  ) throws Exception {
    return applyCommonSecuritySettings(http, rateLimiterFilter)
        .securityMatcher("/media/**")
        .csrf(AbstractHttpConfigurer::disable)
        .logout(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(endpoints -> endpoints
            .anyRequest()
            .permitAll())
        .addFilterBefore(new CustomSecurityHeaderFilter(mediaSecurityHeader, basicUtils), AuthorizationFilter.class)
        .build();
  }

  @Bean
  public JwtAuthenticationConverter jwtAuthenticationConverter() {
    var jwtAuthenticationConverter = new JwtAuthenticationConverter();
    var authentikAuthenticationConverter = new AuthentikAuthenticationConverter();
    jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(authentikAuthenticationConverter);
    return jwtAuthenticationConverter;
  }

  @Bean
  public RateLimiterFilter rateLimiterFilter(RateLimiterService rateLimiterService) {
    return new RateLimiterFilterImpl(rateLimiterService);
  }

  /* PRIVATE METHODS AND CLASSES */

  private HttpSecurity applyCommonSecuritySettings(HttpSecurity http, RateLimiterFilter filter) throws Exception {
    return http
        .sessionManagement(sessionManagement -> {
          sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        })
        .csrf(AbstractHttpConfigurer::disable)
        .httpBasic(AbstractHttpConfigurer::disable)
        .formLogin(AbstractHttpConfigurer::disable)
        .addFilterBefore(filter, AuthorizationFilter.class);
  }

  private static void configureUserExceptionHandling(
      ExceptionHandlingConfigurer<HttpSecurity> ex,
      ObjectMapper objectMapper
  ) {
    ex.authenticationEntryPoint((_, response, authException) -> {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.setContentType("application/json");
      var body = objectMapper.writeValueAsString(ServerAuthenticationResponse.failure(
          "Unauthorized",
          authException.getMessage()
      ));
      response
          .getWriter()
          .write(body);
    });

    ex.accessDeniedHandler((_, response, accessDeniedException) -> {
      response.setStatus(HttpServletResponse.SC_FORBIDDEN);
      response.setContentType("application/json");
      var body = objectMapper.writeValueAsString(ServerAuthenticationResponse.failure(
          "Access Denied",
          accessDeniedException.getMessage()
      ));
      response
          .getWriter()
          .write(body);
    });
  }

  private static OAuth2TokenValidator<Jwt> audienceValidator(String clientId) {
    return jwt -> {
      if (jwt
          .getAudience()
          .contains(clientId)) {
        return OAuth2TokenValidatorResult.success();
      }
      var error = new OAuth2Error("invalid_token", "Token audience does not contain required client ID", null);
      return OAuth2TokenValidatorResult.failure(error);
    };
  }

  private static class AuthentikAuthenticationConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    @Override
    public @Nullable Collection<GrantedAuthority> convert(@NonNull Jwt source) {
      Set<String> roles = extractRoles(source);
      if (roles.isEmpty()) {
        return List.of();
      }

      return roles
          .stream()
          .map(this::normalizeRole)
          .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
          .collect(Collectors.toList());
    }

    private Set<String> extractRoles(Jwt source) {
      var claims = source.getClaims();
      var roles = new LinkedHashSet<String>();

      // Authentik usually exposes groups directly on the "groups" claim.
      var rawGroupsClaim = claims.get("groups");
      if (rawGroupsClaim instanceof Collection<?> groups) {
        groups
            .stream()
            .map(Object::toString)
            .map(String::trim)
            .filter(groupName -> !groupName.isBlank())
            .forEach(groupName -> {
              var lowerCaseGroupName = groupName.toLowerCase();
              if (lowerCaseGroupName.contains("admin")) {
                roles.add("ADMIN");
              }
              if (lowerCaseGroupName.contains("user")) {
                roles.add("USER");
              }
            });
      }

      return roles;
    }

    private String normalizeRole(String role) {
      var normalizedRole = role.toUpperCase();
      if (normalizedRole.startsWith("ROLE_")) {
        return normalizedRole.substring("ROLE_".length());
      }
      return normalizedRole;
    }
  }
}
