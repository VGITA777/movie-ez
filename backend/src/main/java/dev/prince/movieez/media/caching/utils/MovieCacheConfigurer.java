package dev.prince.movieez.media.caching.utils;

import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.Duration;
import org.springframework.cache.caffeine.CaffeineCacheManager;

public class MovieCacheConfigurer {

  public static final String MOVIE_ALTERNATIVE_TITLES_CACHE = "movieAlternativeTitles";
  public static final String MOVIE_CREDITS_CACHE = "movieCredits";
  public static final String MOVIE_DETAILS_CACHE = "movieDetails";
  public static final String MOVIE_IMAGES_CACHE = "movieImages";
  public static final String MOVIE_KEYWORDS_CACHE = "movieKeywords";
  public static final String MOVIE_RECOMMENDATIONS_CACHE = "movieRecommendations";
  public static final String MOVIE_SIMILAR_CACHE = "movieSimilar";
  public static final String MOVIE_VIDEOS_CACHE = "movieVideos";
  public static final String MOVIE_LATEST_CACHE = "latestMovie";

  public static void configureMovieCaches(CaffeineCacheManager cacheManager) {
    configureMovieAlternativeTitlesCache(cacheManager);
    configureMovieCreditsCache(cacheManager);
    configureMovieDetailsCache(cacheManager);
    configureMovieImagesCache(cacheManager);
    configureMovieKeywordsCache(cacheManager);
    configureLatestMovieCache(cacheManager);
    configureMovieRecommendationsCache(cacheManager);
    configureMovieSimilarCache(cacheManager);
    configureMovieVideosCache(cacheManager);
  }

  private static void configureMovieAlternativeTitlesCache(CaffeineCacheManager cacheManager) {
    cacheManager.registerCustomCache(
        MOVIE_ALTERNATIVE_TITLES_CACHE,
        Caffeine.newBuilder().maximumSize(500).expireAfterWrite(Duration.ofDays(7)).build()
    );
  }

  private static void configureMovieCreditsCache(CaffeineCacheManager cacheManager) {
    cacheManager.registerCustomCache(
        MOVIE_CREDITS_CACHE,
        Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(Duration.ofDays(7))
                .build()
    );
  }

  private static void configureMovieDetailsCache(CaffeineCacheManager cacheManager) {
    cacheManager.registerCustomCache(
        MOVIE_DETAILS_CACHE,
        Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(Duration.ofDays(7))
                .build()
    );
  }

  private static void configureMovieImagesCache(CaffeineCacheManager cacheManager) {
    cacheManager.registerCustomCache(
        MOVIE_IMAGES_CACHE,
        Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(Duration.ofDays(7))
                .build()
    );
  }

  private static void configureMovieKeywordsCache(CaffeineCacheManager cacheManager) {
    cacheManager.registerCustomCache(
        MOVIE_KEYWORDS_CACHE,
        Caffeine.newBuilder().maximumSize(500).expireAfterWrite(Duration.ofDays(7)).build()
    );
  }

  public static void configureLatestMovieCache(CaffeineCacheManager cacheManager) {
    cacheManager.registerCustomCache(
        MOVIE_LATEST_CACHE,
        Caffeine.newBuilder()
                .maximumSize(500)
                .expireAfterWrite(Duration.ofMinutes(1))
                .build()
    );
  }

  private static void configureMovieRecommendationsCache(CaffeineCacheManager cacheManager) {
    cacheManager.registerCustomCache(
        MOVIE_RECOMMENDATIONS_CACHE,
        Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(Duration.ofDays(1))
                .build()
    );
  }

  private static void configureMovieSimilarCache(CaffeineCacheManager cacheManager) {
    cacheManager.registerCustomCache(
        MOVIE_SIMILAR_CACHE,
        Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(Duration.ofDays(1))
                .build()
    );
  }

  private static void configureMovieVideosCache(CaffeineCacheManager cacheManager) {
    cacheManager.registerCustomCache(
        MOVIE_VIDEOS_CACHE,
        Caffeine.newBuilder().maximumSize(500).expireAfterWrite(Duration.ofDays(7)).build()
    );
  }
}
