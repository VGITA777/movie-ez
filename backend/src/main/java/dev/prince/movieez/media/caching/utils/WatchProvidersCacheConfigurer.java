package dev.prince.movieez.media.caching.utils;

import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.Duration;
import org.springframework.cache.caffeine.CaffeineCacheManager;

public class WatchProvidersCacheConfigurer {

  public static final String MOVIE_WATCH_PROVIDERS = "movieWatchProviders";
  public static final String TV_SERIES_WATCH_PROVIDERS = "tvSeriesWatchProviders";

  public static void configureWatchProvidersCaches(CaffeineCacheManager cacheManager) {
    configureMovieWatchProvidersCache(cacheManager);
    configureTvSeriesWatchProvidersCache(cacheManager);
  }

  private static void configureMovieWatchProvidersCache(CaffeineCacheManager cacheManager) {
    cacheManager.registerCustomCache(
        MOVIE_WATCH_PROVIDERS,
        Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(Duration.ofDays(1))
                .build()
    );
  }

  private static void configureTvSeriesWatchProvidersCache(CaffeineCacheManager cacheManager) {
    cacheManager.registerCustomCache(
        TV_SERIES_WATCH_PROVIDERS,
        Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(Duration.ofDays(1))
                .build()
    );
  }
}

