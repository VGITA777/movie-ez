package dev.prince.movieez.media.api.controllers;

import dev.prince.movieez.media.api.models.enums.Language;
import dev.prince.movieez.media.api.models.shared.CreditsModel;
import dev.prince.movieez.media.api.models.shared.ImagesModel;
import dev.prince.movieez.media.api.models.shared.VideosModel;
import dev.prince.movieez.media.api.models.tvseries.TvSeriesDetailsModel;
import dev.prince.movieez.media.api.models.tvseries.TvSeriesKeywordsModel;
import dev.prince.movieez.media.api.models.tvseries.TvSeriesLatestModel;
import dev.prince.movieez.media.api.models.tvseries.TvSeriesRecommendationsModel;
import dev.prince.movieez.media.api.models.tvseries.TvSeriesSimilarModel;
import dev.prince.movieez.media.api.tmdb.services.TvSeriesRequestsService;
import dev.prince.movieez.media.api.utils.ResponseEntityUtils;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/media/tv-series")
public class TvSeriesController {

  private final TvSeriesRequestsService tvSeriesRequestsService;

  @Autowired
  public TvSeriesController(TvSeriesRequestsService tvSeriesRequestsService) {
    this.tvSeriesRequestsService = tvSeriesRequestsService;
  }

  @GetMapping("/{seriesId}/credits")
  public ResponseEntity<CreditsModel> getTvSeriesCredits(
      @PathVariable
      long seriesId,
      @RequestParam(defaultValue = "en", required = false)
      String language
  ) {
    return ResponseEntityUtils
        .okPrivateOneWeek()
        .body(tvSeriesRequestsService.getTvSeriesCredits(seriesId, language));
  }

  @GetMapping("/{seriesId}/details")
  public ResponseEntity<TvSeriesDetailsModel> getTvSeriesDetails(
      @PathVariable
      long seriesId,
      @RequestParam(defaultValue = "en", required = false)
      String language
  ) {

    return ResponseEntityUtils
        .okPrivateOneWeek()
        .body(tvSeriesRequestsService.getTvSeriesDetails(seriesId, language));
  }

  @GetMapping("/{seriesId}/images")
  public ResponseEntity<ImagesModel> getTvSeriesImages(
      @PathVariable
      long seriesId,
      @RequestParam(defaultValue = "en", required = false)
      String language
  ) {
    return ResponseEntityUtils
        .okPrivateOneWeek()
        .body(tvSeriesRequestsService.getTvSeriesImages(seriesId, language));
  }

  @GetMapping("/{seriesId}/keywords")
  public ResponseEntity<TvSeriesKeywordsModel> getTvSeriesKeywords(
      @PathVariable
      long seriesId
  ) {
    return ResponseEntityUtils
        .okPrivateOneWeek()
        .body(tvSeriesRequestsService.getTvSeriesKeywords(seriesId));
  }

  @GetMapping("/latest")
  public ResponseEntity<TvSeriesLatestModel> getLatestTvSeries() {
    return ResponseEntity.ok(tvSeriesRequestsService.getLatestTvSeries());
  }

  @GetMapping("/{seriesId}/recommendations")
  public ResponseEntity<TvSeriesRecommendationsModel> getTvSeriesRecommendations(
      @PathVariable
      long seriesId,
      @RequestParam(value = "language", defaultValue = "en", required = false)
      Language language,
      @RequestParam(defaultValue = "1", required = false)
      @Min(value = 1, message = "{constraint.Page.message}")
      int page
  ) {
    return ResponseEntityUtils
        .okPrivateOneDay()
        .body(tvSeriesRequestsService.getTvSeriesRecommendations(seriesId, language.getIsoCode(), page));
  }

  @GetMapping("/{seriesId}/similar")
  public ResponseEntity<TvSeriesSimilarModel> getTvSeriesSimilar(
      @PathVariable
      long seriesId,
      @RequestParam(value = "language", defaultValue = "en", required = false)
      Language language,
      @RequestParam(defaultValue = "1", required = false)
      @Min(value = 1, message = "{constraint.Page.message}")
      int page
  ) {
    return ResponseEntityUtils
        .okPrivateOneDay()
        .body(tvSeriesRequestsService.getTvSeriesSimilar(seriesId, language.getIsoCode(), page));
  }

  @GetMapping("/{seriesId}/videos")
  public ResponseEntity<VideosModel> getTvSeriesVideos(
      @PathVariable
      long seriesId,
      @RequestParam(value = "language", defaultValue = "en", required = false)
      Language language
  ) {
    return ResponseEntityUtils
        .okPrivateOneDay()
        .body(tvSeriesRequestsService.getTvSeriesVideos(seriesId, language.getIsoCode()));
  }
}
