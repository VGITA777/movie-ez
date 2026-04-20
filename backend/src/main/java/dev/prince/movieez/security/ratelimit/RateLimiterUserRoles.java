package dev.prince.movieez.security.ratelimit;

import dev.prince.movieez.user.models.MovieEzAppRole;
import io.github.resilience4j.ratelimiter.RateLimiterConfig;
import java.time.Duration;

/**
 * Enum representing different user roles and their associated rate limiting configurations.
 */
public enum RateLimiterUserRoles {
  GUEST(10, Duration.ofSeconds(1), Duration.ofMillis(250)),
  USER(25, Duration.ofSeconds(1), Duration.ofSeconds(1)),
  ADMIN(100, Duration.ofSeconds(1), Duration.ofSeconds(5));

  private final int limitForPeriod;
  private final Duration limitRefreshPeriod;
  private final Duration timeoutDuration;

  RateLimiterUserRoles(int limitForPeriod, Duration limitRefreshPeriod, Duration timeoutDuration) {
    this.limitForPeriod = limitForPeriod;
    this.limitRefreshPeriod = limitRefreshPeriod;
    this.timeoutDuration = timeoutDuration;
  }

  public static RateLimiterUserRoles from(MovieEzAppRole role) {
    return switch (role) {
      case USER -> USER;
      case ADMIN -> ADMIN;
      default -> GUEST;
    };
  }

  public RateLimiterConfig getRateLimiterConfig() {
    return RateLimiterConfig.custom()
                            .limitForPeriod(limitForPeriod)
                            .limitRefreshPeriod(limitRefreshPeriod)
                            .timeoutDuration(timeoutDuration)
                            .build();
  }
}
