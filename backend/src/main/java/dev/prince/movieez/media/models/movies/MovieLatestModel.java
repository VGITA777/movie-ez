package dev.prince.movieez.media.models.movies;

import dev.prince.movieez.media.models.enums.MediaType;

/**
 * Model representing the response from the TMDB "Get Latest Movie" endpoint. This model extends
 * {@link MovieDetailsModel} and may include additional fields specific to the latest movie response.
 *
 * @see <a href=https://developer.themoviedb.org/reference/movie-latest-id>Movie Latest API Referece</a>
 */
public class MovieLatestModel extends MovieDetailsModel {

  public MovieLatestModel() {
    super();
  }

  public MovieLatestModel(
      BelongsToCollection belongs_to_collection,
      long budget,
      String imdb_id,
      String original_title,
      String release_date,
      long revenue,
      int runtime,
      String title,
      boolean video,
      MediaType media_type
  ) {
    super(
        belongs_to_collection,
        budget,
        imdb_id,
        original_title,
        release_date,
        revenue,
        runtime,
        title,
        video,
        media_type
    );
  }
}
