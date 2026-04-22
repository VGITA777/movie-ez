package dev.prince.movieez.security.authentik;

import dev.prince.movieez.user.models.MovieEzUserModel;
import dev.prince.movieez.user.repository.MovieEzUserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
public class AuthentikUserSyncFilter extends OncePerRequestFilter {

  private final MovieEzUserRepository movieEzUserRepository;

  public AuthentikUserSyncFilter(MovieEzUserRepository movieEzUserRepository) {
    this.movieEzUserRepository = movieEzUserRepository;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    var authentication = SecurityContextHolder
        .getContext()
        .getAuthentication();

    if ((!(authentication instanceof JwtAuthenticationToken token)) || token.getPrincipal() == null) {
      filterChain.doFilter(request, response);
      return;
    }

    var jwt = (Jwt) token.getPrincipal();
    var userId = parseUserId(jwt.getSubject());
    if (userId.isEmpty()) {
      filterChain.doFilter(request, response);
      return;
    }

    var optionalUser = movieEzUserRepository.findById(userId.get());
    if (optionalUser.isEmpty()) {
      handleNewUser(userId.get(), jwt);
      filterChain.doFilter(request, response);
      return;
    }

    var user = optionalUser.get();
    user.setEmail(resolveEmail(jwt));
    user.setUsername(resolveUsername(jwt));
    user.setEnabled(resolveEnabled(jwt));
    movieEzUserRepository.save(user);

    filterChain.doFilter(request, response);
  }

  private void handleNewUser(UUID userId, Jwt jwt) {
    var movieEzUserModel = MovieEzUserModel
        .builder()
        .id(userId)
        .email(resolveEmail(jwt))
        .username(resolveUsername(jwt))
        .enabled(resolveEnabled(jwt))
        .build();
    movieEzUserRepository.save(movieEzUserModel);
  }

  private Optional<UUID> parseUserId(String subject) {
    try {
      return Optional.of(UUID.fromString(subject));
    } catch (IllegalArgumentException exception) {
      log.warn("Skipping user sync because JWT sub '{}' is not a UUID", subject);
      return Optional.empty();
    }
  }

  private String resolveUsername(Jwt jwt) {
    var preferredUsername = jwt.getClaimAsString("preferred_username");
    if (preferredUsername != null && !preferredUsername.isBlank()) {
      return preferredUsername;
    }

    var nickname = jwt.getClaimAsString("nickname");
    if (nickname != null && !nickname.isBlank()) {
      return nickname;
    }

    var email = jwt.getClaimAsString("email");
    if (email != null && !email.isBlank()) {
      return email;
    }

    return jwt.getSubject();
  }

  private String resolveEmail(Jwt jwt) {
    var email = jwt.getClaimAsString("email");
    if (email != null && !email.isBlank()) {
      return email;
    }
    return jwt.getSubject() + "@unknown.local";
  }

  private boolean resolveEnabled(Jwt jwt) {
    var enabled = jwt.getClaimAsBoolean("enabled");
    return enabled == null || enabled;
  }
}
