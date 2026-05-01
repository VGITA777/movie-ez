package dev.prince.movieez.media.caching.utils;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.caffeine.CaffeineCacheManager;

public class TvSeasonCacheConfigurer {

  public static final String TV_SEASON_DETAILS = "tvSeasonDetailsCache";

  public static void configureTvSeasonsCaches(CaffeineCacheManager cacheManager) {
    configureTvSeasonDetailsCache(cacheManager);
  }

  private static void configureTvSeasonDetailsCache(CaffeineCacheManager cacheManager) {
    cacheManager.registerCustomCache(
        TV_SEASON_DETAILS,
        Caffeine
            .newBuilder()
            .maximumSize(500)
            .expireAfterWrite(java.time.Duration.ofHours(1))
            .build()
    );
  }
}
