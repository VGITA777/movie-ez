package dev.prince.movieez.media.api.models.shared;

import lombok.Data;

/**
 * Represents a production country for movies and TV series. This is a shared model used by both movie and TV series
 * responses.
 */
@Data
public class ProductionCountry {

  private String iso_3166_1;
  private String name;
}