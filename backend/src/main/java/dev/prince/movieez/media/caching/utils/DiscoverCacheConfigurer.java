package dev.prince.movieez.media.caching.utils;

import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.Duration;
import org.springframework.cache.caffeine.CaffeineCacheManager;

public class DiscoverCacheConfigurer {

  public static final String DISCOVER_MOVIES_CACHE = "discoverMovies";
  public static final String DISCOVER_TV_SERIES_CACHE = "discoverTvSeries";

  public static void configureDiscoverCaches(CaffeineCacheManager caffeineCacheManager) {
    configureCacheMovies(caffeineCacheManager);
    configureCacheTvSeries(caffeineCacheManager);
  }

  private static void configureCacheMovies(CaffeineCacheManager caffeineCacheManager) {
    caffeineCacheManager.registerCustomCache(
        DISCOVER_MOVIES_CACHE,
        Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(Duration.ofMinutes(5))
                .build()
    );
  }

  private static void configureCacheTvSeries(CaffeineCacheManager caffeineCacheManager) {
    caffeineCacheManager.registerCustomCache(
        DISCOVER_TV_SERIES_CACHE,
        Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(Duration.ofMinutes(5))
                .build()
    );
  }
}
