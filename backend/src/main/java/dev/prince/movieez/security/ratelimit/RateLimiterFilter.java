package dev.prince.movieez.security.ratelimit;

import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Abstract base class for rate limiter filters that ensures the filter is executed only once per request.
 */
public abstract class RateLimiterFilter extends OncePerRequestFilter {

}
