package dev.prince.movieez.security.filters;

import dev.prince.movieez.security.tokens.MovieEzGuestAuthenticationToken;
import dev.prince.movieez.shared.models.responses.ServerGenericResponse;
import dev.prince.movieez.shared.utilities.BasicUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * A custom authentication filter for the /media/** endpoint. This filter uses a custom header to identify if a request
 * is authenticated.
 */
public final class CustomSecurityHeaderFilter extends OncePerRequestFilter {

  public static final String HEADER_NAME = "X-Ez-Movie";
  private static final SecurityContextHolderStrategy securityContextHolderStrategy = SecurityContextHolder.getContextHolderStrategy();
  private final byte[] headerBytesValue;
  private final BasicUtils basicUtils;

  public CustomSecurityHeaderFilter(String headerValue, BasicUtils basicUtils) {
    this.headerBytesValue = (headerValue == null || headerValue.isBlank())
                            ? null
                            : headerValue.getBytes(StandardCharsets.UTF_8);
    this.basicUtils = basicUtils;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    // No header value configured, skip authentication
    if (headerBytesValue == null) {
      filterChain.doFilter(request, response);
      return;
    }

    String requestHeader = request.getHeader(HEADER_NAME);
    if (requestHeader == null) {
      sendJsonError(response, HttpStatus.UNAUTHORIZED.value(), "What are you doing?");
      return;
    }
    boolean ok = MessageDigest.isEqual(requestHeader.getBytes(StandardCharsets.UTF_8), headerBytesValue);
    if (!ok) {
      sendJsonError(response, HttpStatus.UNAUTHORIZED.value(), "Maybe try something else?");
      return;
    }

    Authentication authentication = new MovieEzGuestAuthenticationToken();
    SecurityContext context = securityContextHolderStrategy.createEmptyContext();
    context.setAuthentication(authentication);
    SecurityContextHolder.setContext(context);

    filterChain.doFilter(request, response);
  }

  private void sendJsonError(HttpServletResponse response, int status, String message) {
    basicUtils.sendJson(HttpStatus.valueOf(status), ServerGenericResponse.failure(message, null), response);
  }
}
