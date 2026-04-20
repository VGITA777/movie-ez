package dev.prince.movieez.media.caching.utils;

import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.Duration;
import org.springframework.cache.caffeine.CaffeineCacheManager;

public class SearchCacheConfigurer {

  public static final String SEARCH_MULTI_RESULTS_CACHE = "searchMultiResults";
  public static final String SEARCH_MOVIE_RESULTS_CACHE = "searchMovieResults";
  public static final String SEARCH_TV_SERIES_RESULTS_CACHE = "searchTvSeriesResults";

  public static void configureSearchCaches(CaffeineCacheManager cacheManager) {
    configureSearchMultiResultsCache(cacheManager);
    configureSearchMovieResultsCache(cacheManager);
    configureSearchTvSeriesResultsCache(cacheManager);
  }

  private static void configureSearchMultiResultsCache(CaffeineCacheManager cacheManager) {
    cacheManager.registerCustomCache(
        SEARCH_MULTI_RESULTS_CACHE,
        Caffeine.newBuilder().maximumSize(1000).expireAfterWrite(Duration.ofHours(1)).build()
    );
  }

  public static void configureSearchMovieResultsCache(CaffeineCacheManager cacheManager) {
    cacheManager.registerCustomCache(
        SEARCH_MOVIE_RESULTS_CACHE,
        Caffeine.newBuilder().maximumSize(1000).expireAfterWrite(Duration.ofHours(1)).build()
    );
  }

  public static void configureSearchTvSeriesResultsCache(CaffeineCacheManager cacheManager) {
    cacheManager.registerCustomCache(
        SEARCH_TV_SERIES_RESULTS_CACHE,
        Caffeine.newBuilder().maximumSize(1000).expireAfterWrite(Duration.ofHours(1)).build()
    );
  }

}
