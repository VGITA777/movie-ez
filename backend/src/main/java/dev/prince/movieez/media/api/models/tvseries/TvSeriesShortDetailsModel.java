package dev.prince.movieez.media.api.models.tvseries;

import dev.prince.movieez.media.api.models.shared.MediaShortDetailsModel;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Response model for The Movie Database (TMDB) API's TV series endpoints that return short details. Contains basic
 * information about a TV series such as name, original name, first air date, etc.
 *
 * @see <a href="https://developer.themoviedb.org/reference/tv-series-details">TV Series API Reference</a>
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class TvSeriesShortDetailsModel extends MediaShortDetailsModel {

  private String name;
  private String original_name;
  private String first_air_date;
  private List<String> origin_country;
}
