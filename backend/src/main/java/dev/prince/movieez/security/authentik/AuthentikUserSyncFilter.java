package dev.prince.movieez.security.authentik;

import dev.prince.movieez.security.models.UserModel;
import dev.prince.movieez.security.repositories.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
public class AuthentikUserSyncFilter extends OncePerRequestFilter {

  private final UserRepository userRepository;

  public AuthentikUserSyncFilter(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    var token = extractToken(request);

    if (token == null) {
      filterChain.doFilter(request, response);
      return;
    }

    var user = extractUser(token);
    var userToBeSaved = userRepository
        .findById(user.getId())
        .map(existing -> {
          existing.setEmail(user.getEmail());
          existing.setUsername(user.getUsername());
          return existing;
        })
        .orElse(user);
    userRepository.save(userToBeSaved);
    filterChain.doFilter(request, response);
  }

  private Jwt extractToken(HttpServletRequest request) {
    var context = SecurityContextHolder.getContext();
    if (context.getAuthentication() == null) {
      return null;
    }

    var principal = context
        .getAuthentication()
        .getPrincipal();
    if (principal instanceof Jwt token) {
      return token;
    }

    return null;
  }

  private UserModel extractUser(Jwt token) {
    var claims = token.getClaims();

    // Required: subject must be a valid UUID
    var subject = token.getSubject();
    if (subject == null || subject.isBlank()) {
      throw new IllegalArgumentException("JWT subject (sub) is missing");
    }

    final UUID id;
    try {
      id = UUID.fromString(subject);
    } catch (IllegalArgumentException ex) {
      throw new IllegalArgumentException("JWT subject (sub) is not a valid UUID: " + subject, ex);
    }

    // Read as String only if actually String, else null
    var emailObj = claims.get("email");
    var nicknameObj = claims.get("nickname");

    String email = (emailObj instanceof String s && !s.isBlank()) ? s : null;
    String username = (nicknameObj instanceof String s && !s.isBlank()) ? s : null;

    // Fallback strategy for username
    if (username == null) {
      if (email != null && email.contains("@")) {
        username = email.substring(0, email.indexOf('@'));
      } else {
        username = "user-" + id
            .toString()
            .substring(0, 8);
      }
    }

    return UserModel
        .builder()
        .id(id)
        .email(email)
        .username(username)
        .build();
  }
}
