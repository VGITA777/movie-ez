package dev.prince.movieez.media.api.models.movies;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response model for The Movie Database (TMDB) API's alternative titles endpoint. Contains a list of alternative titles
 * for a specific movie across different countries.
 *
 * @see <a href="https://developer.themoviedb.org/reference/movie-alternative-titles">Movie Alternative Titles API
 * Reference</a>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieAlternativeTitlesModel {

  private long id;
  private List<AlternativeTitle> titles;

  @Data
  public static class AlternativeTitle {

    private String iso_3166_1;
    private String title;
    private String type; // Nullable, may be missing from some results
  }
}
