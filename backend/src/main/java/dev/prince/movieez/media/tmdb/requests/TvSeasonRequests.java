package dev.prince.movieez.media.tmdb.requests;

import dev.prince.movieez.media.models.tvseries.TvSeasonDetailsModel;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(url = "/tv")
public interface TvSeasonRequests {

  @GetExchange("/{seriesId}/season/{seasonNumber}")
  TvSeasonDetailsModel getTvEpisodeDetails(
      @PathVariable
      long seriesId,
      @PathVariable
      int seasonNumber,
      @RequestParam(value = "language", defaultValue = "en", required = false)
      String language
  );
}
