package dev.prince.movieez.security.ratelimit;

import dev.prince.movieez.ServerResponse;
import dev.prince.movieez.security.SecurityUtils;
import dev.prince.movieez.security.models.UserIdentifier;
import dev.prince.movieez.users.UserRole;
import io.github.resilience4j.ratelimiter.RateLimiter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Comparator;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.json.JsonMapper;

/**
 * Implementation of the {@linkplain RateLimiterFilter} that applies rate limiting based on user roles and IP
 * addresses.
 */
public class RateLimiterFilterImpl extends RateLimiterFilter {

  private static final SecurityContextHolderStrategy contextHolderStrategy = SecurityContextHolder.getContextHolderStrategy();
  private static final ObjectMapper mapper = JsonMapper.shared();
  private final RateLimiterService rateLimiterService;

  public RateLimiterFilterImpl(RateLimiterService rateLimiterService) {
    this.rateLimiterService = rateLimiterService;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    RateLimiterIdentifier rateLimiterIdentifier;
    var requestURI = request.getRequestURI();
    var identifier = getIp(request);

    logger.debug("Processing rate limiting for user: " + identifier + " and request URI: " + requestURI);

    var authentication = contextHolderStrategy
        .getContext()
        .getAuthentication();

    if (authentication == null || !SecurityUtils.isAuthenticated()) {
      rateLimiterIdentifier = new RateLimiterIdentifier(identifier, RateLimiterUserRoles.GUEST, null);
    } else {
      var token = (JwtAuthenticationToken) authentication;
      var role = RateLimiterUserRoles.from(getHighestPriorityRole(token));
      rateLimiterIdentifier = new RateLimiterIdentifier(identifier, role, UserIdentifier.of(token.getToken()));
    }

    var rateLimiter = getOrCreateRateLimiter(rateLimiterIdentifier);

    if (!rateLimiter.acquirePermission()) {
      returnFailResponse(response);
      return;
    }

    filterChain.doFilter(request, response);
  }

  protected String getIp(HttpServletRequest request) {
    // In production, consider using X-Forwarded-For header
    // to get the real client IP behind proxies/load balancers
    return request.getRemoteAddr();
  }

  private UserRole getHighestPriorityRole(JwtAuthenticationToken authentication) {
    if (authentication == null) {
      return UserRole.GUEST;
    }
    var authorities = authentication.getAuthorities();
    return authorities
        .stream()
        .map(grantedAuthority -> UserRole.fromRole(grantedAuthority.getAuthority()))
        .max(Comparator.comparingInt(UserRole::getPriority))
        .orElse(UserRole.GUEST);
  }

  private RateLimiter getOrCreateRateLimiter(RateLimiterIdentifier identifier) {
    var rateLimiter = rateLimiterService.get(identifier);
    return (rateLimiter == null) ? rateLimiterService
                                   .create(identifier)
                                   .getRateLimiter() : rateLimiter.getRateLimiter();
  }

  private void returnFailResponse(HttpServletResponse response) throws IOException {
    var message = ServerResponse.failure("Too many requests. Please try again later.", null);
    response.setStatus(429);
    response.setContentType("application/json");
    response
        .getWriter()
        .write(mapper.writeValueAsString(message));
  }
}
