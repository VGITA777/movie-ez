package dev.prince.movieez.media.models.shared;

import java.util.List;
import lombok.Data;

/**
 * Response model for movie videos from TMDB API.
 *
 * @see <a href="https://developer.themoviedb.org/reference/movie-videos">TMDB Movie Videos API</a>
 */
@Data
public class VideosModel {

  private long id;
  private List<Video> results;
}
