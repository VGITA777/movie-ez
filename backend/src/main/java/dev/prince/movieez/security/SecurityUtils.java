package dev.prince.movieez.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public class SecurityUtils {

  private static final SecurityContextHolderStrategy CONTEXT_HOLDER_STRATEGY = SecurityContextHolder.getContextHolderStrategy();

  public static boolean isAuthenticated() {
    Authentication authentication = CONTEXT_HOLDER_STRATEGY
        .getContext()
        .getAuthentication();
    return authentication instanceof JwtAuthenticationToken;
  }
}
