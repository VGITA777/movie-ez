package dev.prince.movieez.media.api.models.movies;

import dev.prince.movieez.media.api.models.shared.Keyword;
import dev.prince.movieez.media.api.models.shared.Keywords;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Response model for movie keywords from TMDB API.
 *
 * @see <a href="https://developer.themoviedb.org/reference/movie-keywords">TMDB Movie Keywords API</a>
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class MovieKeywordsModel extends Keywords {

  public MovieKeywordsModel() {
    super();
  }

  public MovieKeywordsModel(long id, List<Keyword> keywords) {
    super(id, keywords);
  }
}
