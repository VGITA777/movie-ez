package dev.prince.movieez.media.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.tmdb")
public record TMDBSettings(String apiBaseUrl,
                           String apiKey) {

  public static final String TMDB_BASE_URL = "https://api.themoviedb.org/3";

  public TMDBSettings {
    if (apiBaseUrl == null) {
      apiBaseUrl = TMDB_BASE_URL;
    }
  }
}
