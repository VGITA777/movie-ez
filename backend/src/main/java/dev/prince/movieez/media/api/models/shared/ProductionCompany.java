package dev.prince.movieez.media.api.models.shared;

import lombok.Data;

/**
 * Represents a production company for movies and TV series. This is a shared model used by both movie and TV series
 * responses.
 *
 * @see <a href="https://developer.themoviedb.org/reference/movie-details">Movie Details API Reference</a>
 * @see <a href="https://developer.themoviedb.org/reference/tv-series-details">TV Series Details API Reference</a>
 */
@Data
public class ProductionCompany {

  private long id;
  private String logo_path;
  private String name;
  private String origin_country;
}
