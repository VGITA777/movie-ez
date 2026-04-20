package dev.prince.movieez.media.api.tmdb.services;

import dev.prince.movieez.media.api.resource.TMDBSettings;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Service
public class AppClientService {

  private final RestClient restClient;
  private final RestClientAdapter restClientAdapter;
  private final HttpServiceProxyFactory httpServiceProxyFactory;

  public AppClientService(TMDBSettings tmdbSettings) {
    this.restClient = RestClient.builder()
                                .baseUrl(tmdbSettings.baseUrl())
                                .defaultHeader("Authorization", "Bearer " + tmdbSettings.apiKey())
                                .build();
    this.restClientAdapter = RestClientAdapter.create(restClient);
    this.httpServiceProxyFactory = HttpServiceProxyFactory.builderFor(restClientAdapter).build();
  }

  @Bean
  public RestClient restClient() {
    return restClient;
  }

  @Bean
  public RestClientAdapter restClientAdapter() {
    return restClientAdapter;
  }

  @Bean
  public HttpServiceProxyFactory httpServiceProxyFactory() {
    return httpServiceProxyFactory;
  }
}
