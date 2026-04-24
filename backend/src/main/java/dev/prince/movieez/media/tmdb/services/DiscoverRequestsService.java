package dev.prince.movieez.media.tmdb.services;

import dev.prince.movieez.media.caching.utils.DiscoverCacheConfigurer;
import dev.prince.movieez.media.models.discover.DiscoverMovieModel;
import dev.prince.movieez.media.models.discover.DiscoverTvModel;
import dev.prince.movieez.media.models.inputs.DiscoverMoviesInput;
import dev.prince.movieez.media.models.inputs.DiscoverTvInput;
import dev.prince.movieez.media.models.shared.Page;
import dev.prince.movieez.media.tmdb.requests.DiscoverRequests;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Service
public class DiscoverRequestsService {

  private final DiscoverRequests discoverRequests;

  public DiscoverRequestsService(HttpServiceProxyFactory httpServiceProxyFactory) {
    this.discoverRequests = httpServiceProxyFactory.createClient(DiscoverRequests.class);
  }

  @Cacheable(cacheNames = DiscoverCacheConfigurer.DISCOVER_MOVIES_CACHE)
  public Page<DiscoverMovieModel> discoverMovies(DiscoverMoviesInput input) {
    return discoverRequests.discoverMovies(
        input.isIncludeAdult(),
        input
            .getLanguage()
            .getIsoCode(),
        input.getPrimaryReleaseYear(),
        input.getPage(),
        input.getRegion(),
        input.getYear()
    );
  }

  @Cacheable(cacheNames = DiscoverCacheConfigurer.DISCOVER_TV_SERIES_CACHE)
  public Page<DiscoverTvModel> discoverTv(DiscoverTvInput input) {
    return discoverRequests.discoverTvSeries(
        input.isIncludeAdult(),
        input
            .getLanguage()
            .getIsoCode(),
        input.getFirstAirDateYear(),
        input.getPage()
    );
  }
}
