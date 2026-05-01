package dev.prince.movieez.media.controllers;

import dev.prince.movieez.media.models.enums.Language;
import dev.prince.movieez.media.models.inputs.TvSeasonDetailsInput;
import dev.prince.movieez.media.models.tvseries.TvSeasonDetailsModel;
import dev.prince.movieez.media.tmdb.services.TvSeasonRequestsService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/media/tv-series")
public class TvSeasonController {

  private final TvSeasonRequestsService tvSeasonRequestsService;

  public TvSeasonController(TvSeasonRequestsService tvSeasonRequestsService) {
    this.tvSeasonRequestsService = tvSeasonRequestsService;
  }

  @GetMapping("/{tvSeriesId}/{season}/details")
  public ResponseEntity<TvSeasonDetailsModel> getTvSeasonDetails(
      @PathVariable
      long tvSeriesId,
      @PathVariable
      int season,
      @RequestParam(defaultValue = "en", required = false)
      Language language
  ) {
    var input = TvSeasonDetailsInput
        .builder()
        .seriesId(tvSeriesId)
        .seasonNumber(season)
        .language(language)
        .build();
    return ResponseEntity.ok(tvSeasonRequestsService.getTvSeasonDetails(input));
  }

}
