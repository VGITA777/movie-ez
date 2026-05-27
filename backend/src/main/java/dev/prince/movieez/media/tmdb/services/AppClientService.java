package dev.prince.movieez.media.tmdb.services;

import dev.prince.movieez.media.properties.TMDBSettings;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.JacksonJsonHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;
import tools.jackson.databind.json.JsonMapper;

@Slf4j
@Service
public class AppClientService {

  private final RestClient tmdbRestClient;
  private final RestClientAdapter tmdbRestClientAdapter;
  private final HttpServiceProxyFactory tmdbHttpServiceProxyFactory;

  public AppClientService(TMDBSettings tmdbSettings, JsonMapper jsonMapper) {
    this.tmdbRestClient = RestClient
        .builder()
        .baseUrl(tmdbSettings.apiBaseUrl())
        .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
        .configureMessageConverters(converters -> {
          converters.configureMessageConvertersList(httpMessageConverters -> {
            var jacksonConverter = new JacksonJsonHttpMessageConverter(jsonMapper);

            jacksonConverter.setSupportedMediaTypes(List.of(
                MediaType.APPLICATION_JSON,
                new MediaType("application", "javascript")
            ));

            httpMessageConverters.addFirst(jacksonConverter);
          });
        })
        .requestInterceptor((request, body, execution) -> {
          request
              .getHeaders()
              .setAccept(List.of(MediaType.APPLICATION_JSON));
          request
              .getHeaders()
              .set(HttpHeaders.AUTHORIZATION, "Bearer " + tmdbSettings.apiKey());

          log.info("TMDB request URI: {}", request.getURI());
          log.info(
              "TMDB request Accept: {}",
              request
                  .getHeaders()
                  .getAccept()
          );

          var response = execution.execute(request, body);

          log.info("TMDB response status: {}", response.getStatusCode());
          log.info(
              "TMDB response content-type: {}",
              response
                  .getHeaders()
                  .getContentType()
          );

          return response;
        })
        .defaultHeader("Authorization", "Bearer " + tmdbSettings.apiKey())
        .build();
    this.tmdbRestClientAdapter = RestClientAdapter.create(tmdbRestClient);
    this.tmdbHttpServiceProxyFactory = HttpServiceProxyFactory
        .builderFor(tmdbRestClientAdapter)
        .build();
  }

  @Bean
  public RestClient tmdbRestClient() {
    return tmdbRestClient;
  }

  @Bean
  public RestClientAdapter tmdbRestClientAdapter() {
    return tmdbRestClientAdapter;
  }

  @Bean
  public HttpServiceProxyFactory tmdbHttpServiceProxyFactory() {
    return tmdbHttpServiceProxyFactory;
  }
}
