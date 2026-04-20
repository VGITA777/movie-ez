package dev.prince.movieez.media.api.tmdb.services;

import dev.prince.movieez.media.api.models.movies.MovieAlternativeTitlesModel;
import dev.prince.movieez.media.api.models.movies.MovieDetailsModel;
import dev.prince.movieez.media.api.models.movies.MovieKeywordsModel;
import dev.prince.movieez.media.api.models.movies.MovieLatestModel;
import dev.prince.movieez.media.api.models.movies.MovieRecommendationsModel;
import dev.prince.movieez.media.api.models.movies.MovieSimilarModel;
import dev.prince.movieez.media.api.models.shared.CreditsModel;
import dev.prince.movieez.media.api.models.shared.ImagesModel;
import dev.prince.movieez.media.api.models.shared.VideosModel;
import dev.prince.movieez.media.api.tmdb.requests.MoviesRequests;
import dev.prince.movieez.media.caching.utils.MovieCacheConfigurer;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Service
public class MovieRequestsService {

  private final MoviesRequests moviesRequests;

  public MovieRequestsService(HttpServiceProxyFactory httpServiceProxyFactory) {
    this.moviesRequests = httpServiceProxyFactory.createClient(MoviesRequests.class);
  }

  @Cacheable(cacheNames = MovieCacheConfigurer.MOVIE_ALTERNATIVE_TITLES_CACHE)
  public MovieAlternativeTitlesModel getMovieAlternativeTitles(long movieId, String country) {
    return moviesRequests.getMovieAlternativeTitles(movieId, country);
  }

  @Cacheable(cacheNames = MovieCacheConfigurer.MOVIE_CREDITS_CACHE)
  public CreditsModel getMovieCredits(long movieId, String language) {
    return moviesRequests.getMovieCredits(movieId, language);
  }

  @Cacheable(cacheNames = MovieCacheConfigurer.MOVIE_DETAILS_CACHE)
  public MovieDetailsModel getMovieDetails(long movieId, String language) {
    return moviesRequests.getMovieDetails(movieId, language);
  }

  @Cacheable(cacheNames = MovieCacheConfigurer.MOVIE_IMAGES_CACHE)
  public ImagesModel getMovieImages(long movieId, String language) {
    return moviesRequests.getMovieImages(movieId, language);
  }

  @Cacheable(cacheNames = MovieCacheConfigurer.MOVIE_KEYWORDS_CACHE)
  public MovieKeywordsModel getMovieKeywords(long movieId) {
    return moviesRequests.getMovieKeywords(movieId);
  }

  @Cacheable(cacheNames = MovieCacheConfigurer.MOVIE_LATEST_CACHE)
  public MovieLatestModel getLatest() {
    return moviesRequests.getLatest();
  }

  @Cacheable(cacheNames = MovieCacheConfigurer.MOVIE_RECOMMENDATIONS_CACHE)
  public MovieRecommendationsModel getMovieRecommendations(long movieId, String language, int page) {
    return moviesRequests.getMovieRecommendations(movieId, language, page);
  }

  @Cacheable(cacheNames = MovieCacheConfigurer.MOVIE_SIMILAR_CACHE)
  public MovieSimilarModel getMovieSimilar(long movieId, String language, int page) {
    return moviesRequests.getMovieSimilar(movieId, language, page);
  }

  @Cacheable(cacheNames = MovieCacheConfigurer.MOVIE_VIDEOS_CACHE)
  public VideosModel getMovieVideos(long movieId, String language) {
    return moviesRequests.getMovieVideos(movieId, language);
  }
}
