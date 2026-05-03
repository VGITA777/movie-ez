package dev.prince.movieez.media.tmdb.services;

import dev.prince.movieez.media.caching.utils.MovieListsCacheConfigurer;
import dev.prince.movieez.media.models.inputs.MovieListsInput;
import dev.prince.movieez.media.models.movies.MovieNowPlayingModel;
import dev.prince.movieez.media.models.movies.MoviePopularModel;
import dev.prince.movieez.media.models.movies.MovieTopRatedModel;
import dev.prince.movieez.media.models.movies.MovieUpcomingModel;
import dev.prince.movieez.media.tmdb.requests.MovieListsRequests;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Service
public class MovieListsRequestsService {

  private final MovieListsRequests movieListsRequests;

  public MovieListsRequestsService(HttpServiceProxyFactory httpServiceProxyFactory) {
    this.movieListsRequests = httpServiceProxyFactory.createClient(MovieListsRequests.class);
  }

  @Cacheable(cacheNames = MovieListsCacheConfigurer.MOVIE_NOW_PLAYING_CACHE)
  public MovieNowPlayingModel getNowPlaying(MovieListsInput input) {
    return movieListsRequests.getNowPlaying(
        input.getLanguage().getIsoCode(),
        input.getPage(),
        input.getRegion()
    );
  }

  @Cacheable(cacheNames = MovieListsCacheConfigurer.MOVIE_POPULAR_CACHE)
  public MoviePopularModel getPopular(MovieListsInput input) {
    return movieListsRequests.getPopular(
        input.getLanguage().getIsoCode(),
        input.getPage(),
        input.getRegion()
    );
  }

  @Cacheable(cacheNames = MovieListsCacheConfigurer.MOVIE_TOP_RATED_CACHE)
  public MovieTopRatedModel getTopRated(MovieListsInput input) {
    return movieListsRequests.getTopRated(
        input.getLanguage().getIsoCode(),
        input.getPage(),
        input.getRegion()
    );
  }

  @Cacheable(cacheNames = MovieListsCacheConfigurer.MOVIE_UPCOMING_CACHE)
  public MovieUpcomingModel getUpcoming(MovieListsInput input) {
    return movieListsRequests.getUpcoming(
        input.getLanguage().getIsoCode(),
        input.getPage(),
        input.getRegion()
    );
  }
}

