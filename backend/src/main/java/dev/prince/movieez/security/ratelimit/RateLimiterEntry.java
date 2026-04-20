package dev.prince.movieez.security.ratelimit;

import io.github.resilience4j.ratelimiter.RateLimiter;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RateLimiterEntry {

  private Instant expiryTime;
  private RateLimiterIdentifier rateLimiterIdentifier;
  private RateLimiter rateLimiter;
}
