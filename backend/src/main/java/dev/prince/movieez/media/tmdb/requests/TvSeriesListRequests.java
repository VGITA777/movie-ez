package dev.prince.movieez.media.tmdb.requests;

import dev.prince.movieez.media.models.tvseries.TvSeriesAiringTodayModel;
import dev.prince.movieez.media.models.tvseries.TvSeriesOnTheAirModel;
import dev.prince.movieez.media.models.tvseries.TvSeriesPopularModel;
import dev.prince.movieez.media.models.tvseries.TvSeriesTopRatedModel;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(url = "/tv")
public interface TvSeriesListRequests {

  @GetExchange("/airing_today")
  TvSeriesAiringTodayModel getAiringToday(
      @RequestParam(value = "language")
      String language,
      @RequestParam(value = "page")
      int page,
      @RequestParam(value = "timezone", required = false)
      String timezone
  );

  @GetExchange("/on_the_air")
  TvSeriesOnTheAirModel getOnTheAir(
      @RequestParam(value = "language")
      String language,
      @RequestParam(value = "page")
      int page,
      @RequestParam(value = "timezone", required = false)
      String timezone
  );

  @GetExchange("/popular")
  TvSeriesPopularModel getPopular(
      @RequestParam(value = "language")
      String language,
      @RequestParam(value = "page")
      int page
  );

  @GetExchange("/top_rated")
  TvSeriesTopRatedModel getTopRated(
      @RequestParam(value = "language")
      String language,
      @RequestParam(value = "page")
      int page
  );
}
