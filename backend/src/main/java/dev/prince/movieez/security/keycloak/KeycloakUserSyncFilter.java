package dev.prince.movieez.security.keycloak;

import dev.prince.movieez.user.models.MovieEzUserModel;
import dev.prince.movieez.user.repository.MovieEzUserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
public class KeycloakUserSyncFilter extends OncePerRequestFilter {

  private final MovieEzUserRepository movieEzUserRepository;

  public KeycloakUserSyncFilter(MovieEzUserRepository movieEzUserRepository) {
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
    var userId = UUID.fromString(jwt.getSubject());
    var optionalUser = movieEzUserRepository.findById(userId);

    if (optionalUser.isEmpty()) {
      log.info("User with ID '{}' not found in database, creating new user to the database", userId);
      handleNewUser(jwt);
      log.info("User with ID '{}' successfully created in database", userId);
      filterChain.doFilter(request, response);
      return;
    }

    var user = optionalUser.get();
    var emailClaim = jwt.getClaimAsString("email");
    var usernameClaim = jwt.getClaimAsString("preferred_username");
    var enabledClaim = jwt.getClaimAsBoolean("enabled");

    user.setEmail(emailClaim);
    user.setUsername(usernameClaim);
    user.setEnabled(enabledClaim);
    movieEzUserRepository.save(user);

    log.info("User with ID '{}' successfully synced with database", userId);

    filterChain.doFilter(request, response);
  }

  private void handleNewUser(Jwt jwt) {
    var movieEzUserModel = createMovieEzUserModel(jwt);
    movieEzUserRepository.save(movieEzUserModel);
  }

  private MovieEzUserModel createMovieEzUserModel(Jwt jwt) {
    return MovieEzUserModel
        .builder()
        .id(UUID.fromString(jwt.getSubject()))
        .email(jwt.getClaimAsString("email"))
        .username(jwt.getClaimAsString("preferred_username"))
        .build();
  }

}
