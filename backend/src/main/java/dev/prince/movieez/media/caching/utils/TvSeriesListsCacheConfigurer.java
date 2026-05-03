package dev.prince.movieez.media.caching.utils;

import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.Duration;
import org.springframework.cache.caffeine.CaffeineCacheManager;

public class TvSeriesListsCacheConfigurer {

  public static final String TV_SERIES_AIRING_TODAY_CACHE = "tvSeriesAiringToday";
  public static final String TV_SERIES_ON_THE_AIR_CACHE = "tvSeriesOnTheAir";
  public static final String TV_SERIES_POPULAR_CACHE = "tvSeriesPopular";
  public static final String TV_SERIES_TOP_RATED_CACHE = "tvSeriesTopRated";

  public static void configureTvSeriesListsCaches(CaffeineCacheManager cacheManager) {
    configureAiringTodayCache(cacheManager);
    configureOnTheAirCache(cacheManager);
    configurePopularCache(cacheManager);
    configureTopRatedCache(cacheManager);
  }

  private static void configureAiringTodayCache(CaffeineCacheManager cacheManager) {
    cacheManager.registerCustomCache(
        TV_SERIES_AIRING_TODAY_CACHE,
        Caffeine.newBuilder().maximumSize(1000).expireAfterWrite(Duration.ofHours(1)).build()
    );
  }

  private static void configureOnTheAirCache(CaffeineCacheManager cacheManager) {
    cacheManager.registerCustomCache(
        TV_SERIES_ON_THE_AIR_CACHE,
        Caffeine.newBuilder().maximumSize(1000).expireAfterWrite(Duration.ofHours(1)).build()
    );
  }

  private static void configurePopularCache(CaffeineCacheManager cacheManager) {
    cacheManager.registerCustomCache(
        TV_SERIES_POPULAR_CACHE,
        Caffeine.newBuilder().maximumSize(1000).expireAfterWrite(Duration.ofHours(1)).build()
    );
  }

  private static void configureTopRatedCache(CaffeineCacheManager cacheManager) {
    cacheManager.registerCustomCache(
        TV_SERIES_TOP_RATED_CACHE,
        Caffeine.newBuilder().maximumSize(1000).expireAfterWrite(Duration.ofHours(1)).build()
    );
  }
}

