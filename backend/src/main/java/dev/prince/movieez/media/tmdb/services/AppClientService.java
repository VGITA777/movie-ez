package dev.prince.movieez.media.tmdb.services;

import dev.prince.movieez.media.properties.TMDBSettings;
import org.springframework.context.annotation.Bean;
import org.springframework.http.converter.json.JacksonJsonHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;
import tools.jackson.databind.json.JsonMapper;

@Service
public class AppClientService {

  private final RestClient restClient;
  private final RestClientAdapter restClientAdapter;
  private final HttpServiceProxyFactory httpServiceProxyFactory;

  public AppClientService(TMDBSettings tmdbSettings, JsonMapper jsonMapper) {
    this.restClient = RestClient
        .builder()
        .baseUrl(tmdbSettings.apiBaseUrl())
        .configureMessageConverters(converters -> {
          converters.configureMessageConvertersList(httpMessageConverters -> {
            httpMessageConverters.add(new JacksonJsonHttpMessageConverter(jsonMapper));
          });
        })
        .defaultHeader("Authorization", "Bearer " + tmdbSettings.apiKey())
        .build();
    this.restClientAdapter = RestClientAdapter.create(restClient);
    this.httpServiceProxyFactory = HttpServiceProxyFactory
        .builderFor(restClientAdapter)
        .build();
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
