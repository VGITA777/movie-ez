package dev.prince.movieez.media.tmdb.services;

import dev.prince.movieez.media.models.inputs.TvSeasonDetailsInput;
import dev.prince.movieez.media.models.tvseries.TvSeasonDetailsModel;
import dev.prince.movieez.media.tmdb.requests.TvSeasonRequests;
import org.springframework.stereotype.Service;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Service
public class TvSeasonRequestsService {

  private final TvSeasonRequests tvSeasonRequests;

  public TvSeasonRequestsService(HttpServiceProxyFactory httpServiceProxyFactory) {
    this.tvSeasonRequests = httpServiceProxyFactory.createClient(TvSeasonRequests.class);
  }

  public TvSeasonDetailsModel getTvSeasonDetails(TvSeasonDetailsInput input) {
    return tvSeasonRequests.getTvEpisodeDetails(
        input.getSeriesId(),
        input.getSeasonNumber(),
        input
            .getLanguage()
            .getIsoCode()
    );
  }
}
