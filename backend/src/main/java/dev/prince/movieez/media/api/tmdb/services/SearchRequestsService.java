package dev.prince.movieez.media.api.tmdb.services;

import dev.prince.movieez.media.api.models.inputs.SearchMovieInput;
import dev.prince.movieez.media.api.models.inputs.SearchMultiInput;
import dev.prince.movieez.media.api.models.inputs.SearchTvInput;
import dev.prince.movieez.media.api.models.search.SearchMovieResultsModel;
import dev.prince.movieez.media.api.models.search.SearchMultiResultsModel;
import dev.prince.movieez.media.api.models.search.SearchTvSeriesResultsModel;
import dev.prince.movieez.media.api.tmdb.requests.SearchRequests;
import dev.prince.movieez.media.caching.utils.SearchCacheConfigurer;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Service
public class SearchRequestsService {

  private final SearchRequests searchRequests;

  public SearchRequestsService(HttpServiceProxyFactory httpServiceProxyFactory) {
    this.searchRequests = httpServiceProxyFactory.createClient(SearchRequests.class);
  }

  @Cacheable(cacheNames = SearchCacheConfigurer.SEARCH_MOVIE_RESULTS_CACHE)
  public SearchMovieResultsModel searchMovies(SearchMovieInput input) {
    return searchRequests.searchMovies(
        input.getQuery(),
        input.isIncludeAdult(),
        input.getLanguage().getIsoCode(),
        input.getPrimaryReleaseYear(),
        input.getPage(),
        input.getRegion(),
        input.getYear()
    );
  }

  @Cacheable(cacheNames = SearchCacheConfigurer.SEARCH_TV_SERIES_RESULTS_CACHE)
  public SearchTvSeriesResultsModel searchTvSeries(SearchTvInput input) {
    return searchRequests.searchTvSeries(
        input.getQuery(),
        input.getFirstAirDateYear(),
        input.isIncludeAdult(),
        input.getLanguage().getIsoCode(),
        input.getPage(),
        input.getPage()
    );
  }

  @Cacheable(cacheNames = SearchCacheConfigurer.SEARCH_MULTI_RESULTS_CACHE)
  public SearchMultiResultsModel searchMulti(SearchMultiInput input) {
    return searchRequests.searchMulti(
        input.getQuery(),
        input.isIncludeAdult(),
        input.getLanguage().getIsoCode(),
        input.getPage()
    );
  }
}

