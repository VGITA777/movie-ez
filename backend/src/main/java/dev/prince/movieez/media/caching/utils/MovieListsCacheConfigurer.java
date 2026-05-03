package dev.prince.movieez.media.caching.utils;

import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.Duration;
import org.springframework.cache.caffeine.CaffeineCacheManager;

public class MovieListsCacheConfigurer {

  public static final String MOVIE_NOW_PLAYING_CACHE = "movieNowPlaying";
  public static final String MOVIE_POPULAR_CACHE = "moviePopular";
  public static final String MOVIE_TOP_RATED_CACHE = "movieTopRated";
  public static final String MOVIE_UPCOMING_CACHE = "movieUpcoming";

  public static void configureMovieListsCaches(CaffeineCacheManager cacheManager) {
    configureNowPlayingCache(cacheManager);
    configurePopularCache(cacheManager);
    configureTopRatedCache(cacheManager);
    configureUpcomingCache(cacheManager);
  }

  private static void configureNowPlayingCache(CaffeineCacheManager cacheManager) {
    cacheManager.registerCustomCache(
        MOVIE_NOW_PLAYING_CACHE,
        Caffeine.newBuilder().maximumSize(1000).expireAfterWrite(Duration.ofHours(1)).build()
    );
  }

  private static void configurePopularCache(CaffeineCacheManager cacheManager) {
    cacheManager.registerCustomCache(
        MOVIE_POPULAR_CACHE,
        Caffeine.newBuilder().maximumSize(1000).expireAfterWrite(Duration.ofHours(1)).build()
    );
  }

  private static void configureTopRatedCache(CaffeineCacheManager cacheManager) {
    cacheManager.registerCustomCache(
        MOVIE_TOP_RATED_CACHE,
        Caffeine.newBuilder().maximumSize(1000).expireAfterWrite(Duration.ofHours(1)).build()
    );
  }

  private static void configureUpcomingCache(CaffeineCacheManager cacheManager) {
    cacheManager.registerCustomCache(
        MOVIE_UPCOMING_CACHE,
        Caffeine.newBuilder().maximumSize(1000).expireAfterWrite(Duration.ofHours(1)).build()
    );
  }
}

