package dev.prince.movieez.media.controllers;

import dev.prince.movieez.ResponseEntityUtils;
import dev.prince.movieez.media.models.inputs.MovieListsInput;
import dev.prince.movieez.media.models.movies.MovieNowPlayingModel;
import dev.prince.movieez.media.models.movies.MoviePopularModel;
import dev.prince.movieez.media.models.movies.MovieTopRatedModel;
import dev.prince.movieez.media.models.movies.MovieUpcomingModel;
import dev.prince.movieez.media.tmdb.services.MovieListsRequestsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/media/movie/lists")
public class MovieListsController {

  private final MovieListsRequestsService movieListsRequestsService;

  public MovieListsController(MovieListsRequestsService movieListsRequestsService) {
    this.movieListsRequestsService = movieListsRequestsService;
  }

  @GetMapping("/now-playing")
  public ResponseEntity<MovieNowPlayingModel> getNowPlaying(
      @Valid
      @ModelAttribute
      MovieListsInput input
  ) {
    return ResponseEntityUtils
        .okPrivateOneDay()
        .body(movieListsRequestsService.getNowPlaying(input));
  }

  @GetMapping("/popular")
  public ResponseEntity<MoviePopularModel> getPopular(
      @Valid
      @ModelAttribute
      MovieListsInput input
  ) {
    return ResponseEntityUtils
        .okPrivateOneDay()
        .body(movieListsRequestsService.getPopular(input));
  }

  @GetMapping("/top-rated")
  public ResponseEntity<MovieTopRatedModel> getTopRated(
      @Valid
      @ModelAttribute
      MovieListsInput input
  ) {
    return ResponseEntityUtils
        .okPrivateOneDay()
        .body(movieListsRequestsService.getTopRated(input));
  }

  @GetMapping("/upcoming")
  public ResponseEntity<MovieUpcomingModel> getUpcoming(
      @Valid
      @ModelAttribute
      MovieListsInput input
  ) {
    return ResponseEntityUtils
        .okPrivateOneDay()
        .body(movieListsRequestsService.getUpcoming(input));
  }
}

