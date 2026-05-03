package dev.prince.movieez.media.tmdb.requests;

import dev.prince.movieez.media.models.movies.MovieNowPlayingModel;
import dev.prince.movieez.media.models.movies.MoviePopularModel;
import dev.prince.movieez.media.models.movies.MovieTopRatedModel;
import dev.prince.movieez.media.models.movies.MovieUpcomingModel;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(url = "/movie")
public interface MovieListsRequests {

  @GetExchange("/now_playing")
  MovieNowPlayingModel getNowPlaying(
      @RequestParam(value = "language")
      String language,
      @RequestParam(value = "page")
      int page,
      @RequestParam(value = "region", required = false)
      String region
  );

  @GetExchange("/popular")
  MoviePopularModel getPopular(
      @RequestParam(value = "language")
      String language,
      @RequestParam(value = "page")
      int page,
      @RequestParam(value = "region", required = false)
      String region
  );

  @GetExchange("/top_rated")
  MovieTopRatedModel getTopRated(
      @RequestParam(value = "language")
      String language,
      @RequestParam(value = "page")
      int page,
      @RequestParam(value = "region", required = false)
      String region
  );

  @GetExchange("/upcoming")
  MovieUpcomingModel getUpcoming(
      @RequestParam(value = "language")
      String language,
      @RequestParam(value = "page")
      int page,
      @RequestParam(value = "region", required = false)
      String region
  );
}
