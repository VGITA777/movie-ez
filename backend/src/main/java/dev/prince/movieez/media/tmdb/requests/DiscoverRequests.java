package dev.prince.movieez.media.tmdb.requests;

import dev.prince.movieez.media.models.discover.DiscoverMovieModel;
import dev.prince.movieez.media.models.discover.DiscoverTvModel;
import dev.prince.movieez.media.models.shared.Page;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(url = "/discover")
public interface DiscoverRequests {

  @GetExchange("/movie")
  Page<DiscoverMovieModel> discoverMovies(
      @RequestParam(value = "include_adult", defaultValue = "false", required = false)
      boolean includeAdult,
      @RequestParam(value = "language", defaultValue = "en", required = false)
      String language,
      @RequestParam(value = "primary_release_year", required = false)
      Integer primaryReleaseYear,
      @RequestParam(value = "page", defaultValue = "1", required = false)
      int page,
      @RequestParam(value = "region", required = false)
      String region,
      @RequestParam(value = "year", required = false)
      Integer year
  );

  @GetExchange("/tv")
  Page<DiscoverTvModel> discoverTvSeries(
      @RequestParam(value = "include_adult", defaultValue = "false", required = false)
      boolean includeAdult,
      @RequestParam(value = "language", defaultValue = "en", required = false)
      String language,
      @RequestParam(value = "first_air_date_year", required = false)
      Integer firstAirDateYear,
      @RequestParam(value = "page", defaultValue = "1", required = false)
      int page
  );
}
