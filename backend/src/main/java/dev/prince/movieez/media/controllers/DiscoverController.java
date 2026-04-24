package dev.prince.movieez.media.controllers;

import dev.prince.movieez.media.models.discover.DiscoverMovieModel;
import dev.prince.movieez.media.models.discover.DiscoverTvModel;
import dev.prince.movieez.media.models.inputs.DiscoverMoviesInput;
import dev.prince.movieez.media.models.inputs.DiscoverTvInput;
import dev.prince.movieez.media.models.shared.Page;
import dev.prince.movieez.media.tmdb.services.DiscoverRequestsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/media/discover")
public class DiscoverController {

  private final DiscoverRequestsService discoverRequestsService;

  public DiscoverController(DiscoverRequestsService discoverRequestsService) {
    this.discoverRequestsService = discoverRequestsService;
  }

  @GetMapping("/movies")
  public ResponseEntity<Page<DiscoverMovieModel>> discoverMovies(
      @Valid
      @ModelAttribute
      DiscoverMoviesInput input
  ) {
    return ResponseEntity.ok(discoverRequestsService.discoverMovies(input));
  }

  @GetMapping("/tv")
  public ResponseEntity<Page<DiscoverTvModel>> discoverTv(
      @Valid
      @ModelAttribute
      DiscoverTvInput input
  ) {
    return ResponseEntity.ok(discoverRequestsService.discoverTv(input));

  }
}
