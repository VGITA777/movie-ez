package dev.prince.movieez.security.ratelimit;

/**
 * Service interface for managing rate limiters based on identifiers.
 */
public interface RateLimiterService {

  RateLimiterEntry get(RateLimiterIdentifier identifier);

  RateLimiterEntry create(RateLimiterIdentifier rateLimiter);
}
