package dev.prince.movieez.media.tmdb.services;

import dev.prince.movieez.media.caching.utils.TvSeriesListsCacheConfigurer;
import dev.prince.movieez.media.models.inputs.TvSeriesListsInput;
import dev.prince.movieez.media.models.tvseries.TvSeriesAiringTodayModel;
import dev.prince.movieez.media.models.tvseries.TvSeriesOnTheAirModel;
import dev.prince.movieez.media.models.tvseries.TvSeriesPopularModel;
import dev.prince.movieez.media.models.tvseries.TvSeriesTopRatedModel;
import dev.prince.movieez.media.tmdb.requests.TvSeriesListRequests;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Service
public class TvSeriesListRequestsService {

  private final TvSeriesListRequests tvSeriesListRequests;

  public TvSeriesListRequestsService(HttpServiceProxyFactory httpServiceProxyFactory) {
    this.tvSeriesListRequests = httpServiceProxyFactory.createClient(TvSeriesListRequests.class);
  }

  @Cacheable(cacheNames = TvSeriesListsCacheConfigurer.TV_SERIES_AIRING_TODAY_CACHE)
  public TvSeriesAiringTodayModel getAiringToday(TvSeriesListsInput input) {
    return tvSeriesListRequests.getAiringToday(
        input.getLanguage().getIsoCode(),
        input.getPage(),
        input.getTimezone()
    );
  }

  @Cacheable(cacheNames = TvSeriesListsCacheConfigurer.TV_SERIES_ON_THE_AIR_CACHE)
  public TvSeriesOnTheAirModel getOnTheAir(TvSeriesListsInput input) {
    return tvSeriesListRequests.getOnTheAir(
        input.getLanguage().getIsoCode(),
        input.getPage(),
        input.getTimezone()
    );
  }

  @Cacheable(cacheNames = TvSeriesListsCacheConfigurer.TV_SERIES_POPULAR_CACHE)
  public TvSeriesPopularModel getPopular(TvSeriesListsInput input) {
    return tvSeriesListRequests.getPopular(
        input.getLanguage().getIsoCode(),
        input.getPage()
    );
  }

  @Cacheable(cacheNames = TvSeriesListsCacheConfigurer.TV_SERIES_TOP_RATED_CACHE)
  public TvSeriesTopRatedModel getTopRated(TvSeriesListsInput input) {
    return tvSeriesListRequests.getTopRated(
        input.getLanguage().getIsoCode(),
        input.getPage()
    );
  }
}

