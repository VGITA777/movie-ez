package dev.prince.movieez.security.ratelimit;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.github.resilience4j.ratelimiter.RateLimiter;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Implementation of the {@linkplain RateLimiterService} that manages rate limiters in memory.
 */
@Slf4j
@Service
public class RateLimiterServiceImpl implements RateLimiterService {


  private final long expiryDurationMinutes;
  private final Cache<String, RateLimiterEntry> rateLimiters;

  public RateLimiterServiceImpl(
      @Value("${app.rate-limiter.expiry-duration-minutes:1}")
      long expiryDurationMinutes
  ) {
    this.expiryDurationMinutes = expiryDurationMinutes;
    rateLimiters = Caffeine.newBuilder()
                           .maximumSize(10_000)
                           .expireAfterAccess(Duration.ofMinutes(expiryDurationMinutes))
                           .build();
  }

  @Override
  public RateLimiterEntry get(RateLimiterIdentifier identifier) {
    verifyRateLimiterIdentifier(identifier);
    var key = keyFor(identifier);
    var entry = rateLimiters.getIfPresent(key);
    if (entry == null) {
      return null;
    }
    updateEntry(entry, identifier);
    return entry;
  }

  @Override
  public RateLimiterEntry create(RateLimiterIdentifier rateLimiterIdentifier) {
    log.debug("Saving rate limiter: {}", rateLimiterIdentifier.getId());
    verifyRateLimiterIdentifier(rateLimiterIdentifier);
    var key = keyFor(rateLimiterIdentifier);
    var newExpiryTime = Instant.now().plus(expiryDurationMinutes, ChronoUnit.MINUTES);

    if (rateLimiters.getIfPresent(key) != null) {
      throw new IllegalStateException(
          "Rate limiter with key: " + key + " already exists. Use get() method to retrieve it.");
    }

    // Create new rate limiter entry
    log.debug("Creating a new rate limiter for key: {}", key);
    var rateLimiterConfig = rateLimiterIdentifier.getRole().getRateLimiterConfig();
    var rateLimiter = RateLimiter.of(rateLimiterIdentifier.getId(), rateLimiterConfig);
    var newRateLimiterEntry = new RateLimiterEntry(newExpiryTime, rateLimiterIdentifier, rateLimiter);
    rateLimiters.asMap().put(key, newRateLimiterEntry);
    return newRateLimiterEntry;
  }

  private void verifyRateLimiterIdentifier(RateLimiterIdentifier identifier) {
    if (identifier == null) {
      throw new IllegalArgumentException("RateLimiterIdentifier is null");
    }
    var id = identifier.getId();
    if (id == null || id.isBlank()) {
      throw new IllegalArgumentException("Invalid RateLimiterIdentifier: id is null or empty");
    }
    if (identifier.getRole() == null) {
      throw new IllegalArgumentException("Invalid RateLimiterIdentifier: role is null");
    }
  }

  private String keyFor(RateLimiterIdentifier identifier) {
    // include id, role and details string to avoid collisions
    var detailsStr = Objects.toString(identifier.getDetails(), "");
    return identifier.getId() + "|" + identifier.getRole().name() + "|" + detailsStr;
  }

  private void updateEntry(RateLimiterEntry entry, RateLimiterIdentifier identifier) {
    var newExpiryTime = Instant.now().plus(expiryDurationMinutes, ChronoUnit.MINUTES);
    entry.setExpiryTime(newExpiryTime);
    if (!entry.getRateLimiterIdentifier().equals(identifier)) {
      log.debug("Updating rate limiter: {}", identifier);
      var newRateLimiterConfig = identifier.getRole().getRateLimiterConfig();
      var newRateLimiter = RateLimiter.of(identifier.getId(), newRateLimiterConfig);
      entry.setRateLimiterIdentifier(identifier);
      entry.setRateLimiter(newRateLimiter);
    }
  }
}
