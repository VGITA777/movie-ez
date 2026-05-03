package dev.prince.movieez.media.controllers;

import dev.prince.movieez.ResponseEntityUtils;
import dev.prince.movieez.media.models.inputs.TvSeriesListsInput;
import dev.prince.movieez.media.models.tvseries.TvSeriesAiringTodayModel;
import dev.prince.movieez.media.models.tvseries.TvSeriesOnTheAirModel;
import dev.prince.movieez.media.models.tvseries.TvSeriesPopularModel;
import dev.prince.movieez.media.models.tvseries.TvSeriesTopRatedModel;
import dev.prince.movieez.media.tmdb.services.TvSeriesListRequestsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/media/tv-series/lists")
public class TvSeriesListsController {

  private final TvSeriesListRequestsService tvSeriesListRequestsService;

  public TvSeriesListsController(TvSeriesListRequestsService tvSeriesListRequestsService) {
    this.tvSeriesListRequestsService = tvSeriesListRequestsService;
  }

  @GetMapping("/airing-today")
  public ResponseEntity<TvSeriesAiringTodayModel> getAiringToday(
      @Valid
      @ModelAttribute
      TvSeriesListsInput input
  ) {
    return ResponseEntityUtils
        .okPrivateOneDay()
        .body(tvSeriesListRequestsService.getAiringToday(input));
  }

  @GetMapping("/on-the-air")
  public ResponseEntity<TvSeriesOnTheAirModel> getOnTheAir(
      @Valid
      @ModelAttribute
      TvSeriesListsInput input
  ) {
    return ResponseEntityUtils
        .okPrivateOneDay()
        .body(tvSeriesListRequestsService.getOnTheAir(input));
  }

  @GetMapping("/popular")
  public ResponseEntity<TvSeriesPopularModel> getPopular(
      @Valid
      @ModelAttribute
      TvSeriesListsInput input
  ) {
    return ResponseEntityUtils
        .okPrivateOneDay()
        .body(tvSeriesListRequestsService.getPopular(input));
  }

  @GetMapping("/top-rated")
  public ResponseEntity<TvSeriesTopRatedModel> getTopRated(
      @Valid
      @ModelAttribute
      TvSeriesListsInput input
  ) {
    return ResponseEntityUtils
        .okPrivateOneDay()
        .body(tvSeriesListRequestsService.getTopRated(input));
  }
}

