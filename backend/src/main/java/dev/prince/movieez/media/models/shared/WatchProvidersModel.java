package dev.prince.movieez.media.models.shared;

import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response model for TMDB watch providers endpoints.
 *
 * @see <a href="https://developer.themoviedb.org/reference/movie-watch-providers">Movie Watch Providers</a>
 * @see <a href="https://developer.themoviedb.org/reference/tv-series-watch-providers">TV Series Watch Providers</a>
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WatchProvidersModel {

  private long id;
  private Map<String, WatchProviderRegion> results;

  @Data
  public static class WatchProviderRegion {

    private String link;
    private List<WatchProvider> flatrate;
    private List<WatchProvider> rent;
    private List<WatchProvider> buy;
    private List<WatchProvider> ads;
    private List<WatchProvider> free;
  }

  @Data
  public static class WatchProvider {

    private int display_priority;
    private String logo_path;
    private int provider_id;
    private String provider_name;
  }
}

