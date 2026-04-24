package dev.prince.movieez.media.controllers;

import dev.prince.movieez.ResponseEntityUtils;
import dev.prince.movieez.media.models.enums.Country;
import dev.prince.movieez.media.models.enums.Language;
import dev.prince.movieez.media.models.movies.MovieAlternativeTitlesModel;
import dev.prince.movieez.media.models.movies.MovieDetailsModel;
import dev.prince.movieez.media.models.movies.MovieKeywordsModel;
import dev.prince.movieez.media.models.movies.MovieRecommendationsModel;
import dev.prince.movieez.media.models.movies.MovieSimilarModel;
import dev.prince.movieez.media.models.shared.CreditsModel;
import dev.prince.movieez.media.models.shared.ImagesModel;
import dev.prince.movieez.media.models.shared.VideosModel;
import dev.prince.movieez.media.tmdb.services.MovieRequestsService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/media/movie")
public class MovieController {

  private final MovieRequestsService movieRequestsService;

  @Autowired
  public MovieController(MovieRequestsService movieRequestsService) {
    this.movieRequestsService = movieRequestsService;
  }

  @GetMapping("/{movieId}/alternative-titles")
  public ResponseEntity<MovieAlternativeTitlesModel> getMovieAlternativeTitles(
      @PathVariable
      long movieId,
      @RequestParam(required = false)
      Country country
  ) {
    return ResponseEntityUtils
        .okPrivateOneWeek()
        .body(movieRequestsService.getMovieAlternativeTitles(movieId, (country == null) ? "" : country.getIsoCode()));
  }

  @GetMapping("/{movieId}/credits")
  public ResponseEntity<CreditsModel> getMovieCredits(
      @PathVariable
      long movieId,
      @RequestParam(defaultValue = "en", required = false)
      Language language
  ) {
    return ResponseEntityUtils
        .okPrivateOneWeek()
        .body(movieRequestsService.getMovieCredits(movieId, language.getIsoCode()));
  }

  @GetMapping("/{movieId}/details")
  public ResponseEntity<MovieDetailsModel> getMovieDetails(
      @PathVariable
      long movieId,
      @RequestParam(defaultValue = "en", required = false)
      Language language
  ) {
    return ResponseEntityUtils
        .okPrivateOneWeek()
        .body(movieRequestsService.getMovieDetails(movieId, language.getIsoCode()));
  }

  @GetMapping("/{movieId}/images")
  public ResponseEntity<ImagesModel> getMovieImages(
      @PathVariable
      long movieId,
      @RequestParam(defaultValue = "en", required = false)
      Language language
  ) {
    return ResponseEntityUtils
        .okPrivateOneWeek()
        .body(movieRequestsService.getMovieImages(movieId, language.getIsoCode()));
  }

  @GetMapping("/{movieId}/keywords")
  public ResponseEntity<MovieKeywordsModel> getMovieKeywords(
      @PathVariable
      long movieId
  ) {
    return ResponseEntityUtils
        .okPrivateOneWeek()
        .body(movieRequestsService.getMovieKeywords(movieId));
  }

  @GetMapping("/latest")
  public ResponseEntity<?> getLatest() {
    return ResponseEntity.ok(movieRequestsService.getLatest());
  }

  @GetMapping("/{movieId}/recommendations")
  public ResponseEntity<MovieRecommendationsModel> getMovieRecommendations(
      @PathVariable
      long movieId,
      @RequestParam(defaultValue = "en", required = false)
      Language language,
      @RequestParam(defaultValue = "1", required = false)
      @Valid
      @Min(value = 1, message = "{constraint.invalid.page.msg}")
      int page
  ) {
    return ResponseEntityUtils
        .okPrivateOneDay()
        .body(movieRequestsService.getMovieRecommendations(movieId, language.getIsoCode(), page));
  }

  @GetMapping("/{movieId}/similar")
  public ResponseEntity<MovieSimilarModel> getMovieSimilar(
      @PathVariable
      long movieId,
      @RequestParam(defaultValue = "en", required = false)
      Language language,
      @RequestParam(defaultValue = "1", required = false)
      @Valid
      @Min(value = 1, message = "{constraint.invalid.page.msg}")
      int page
  ) {
    return ResponseEntityUtils
        .okPrivateOneDay()
        .body(movieRequestsService.getMovieSimilar(movieId, language.getIsoCode(), page));
  }

  @GetMapping("/{movieId}/videos")
  public ResponseEntity<VideosModel> getMovieVideos(
      @PathVariable
      long movieId,
      @RequestParam(required = false)
      Language language
  ) {
    return ResponseEntityUtils
        .okPrivateOneDay()
        .body(movieRequestsService.getMovieVideos(movieId, (language == null) ? "" : language.getIsoCode()));
  }
}
