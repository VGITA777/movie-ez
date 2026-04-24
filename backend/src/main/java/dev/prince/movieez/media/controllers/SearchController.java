package dev.prince.movieez.media.controllers;

import dev.prince.movieez.media.models.inputs.SearchMovieInput;
import dev.prince.movieez.media.models.inputs.SearchMultiInput;
import dev.prince.movieez.media.models.inputs.SearchTvInput;
import dev.prince.movieez.media.models.search.SearchMovieResultsModel;
import dev.prince.movieez.media.models.search.SearchMultiResultsModel;
import dev.prince.movieez.media.models.search.SearchTvSeriesResultsModel;
import dev.prince.movieez.media.tmdb.services.SearchRequestsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/media/search")
public class SearchController {

  private final SearchRequestsService searchRequestsService;

  @Autowired
  public SearchController(SearchRequestsService searchRequestsService) {
    this.searchRequestsService = searchRequestsService;
  }

  @GetMapping("/movie")
  public ResponseEntity<SearchMovieResultsModel> searchMovie(
      @Valid
      @ModelAttribute
      SearchMovieInput input
  ) {
    return ResponseEntity.ok(searchRequestsService.searchMovies(input));
  }

  @GetMapping("/tv")
  public ResponseEntity<SearchTvSeriesResultsModel> searchTvSeries(
      @Valid
      @ModelAttribute
      SearchTvInput input
  ) {
    return ResponseEntity.ok(searchRequestsService.searchTvSeries(input));
  }

  @GetMapping("/multi")
  public ResponseEntity<SearchMultiResultsModel> searchMulti(
      @Valid
      @ModelAttribute
      SearchMultiInput input
  ) {
    return ResponseEntity.ok(searchRequestsService.searchMulti(input));
  }
}
