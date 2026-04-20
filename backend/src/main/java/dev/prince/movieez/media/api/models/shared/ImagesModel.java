package dev.prince.movieez.media.api.models.shared;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response model for images from TMDB API. Contains lists of backdrops, posters, and logos for a movie or TV series.
 *
 * @see <a href="https://developer.themoviedb.org/reference/movie-images">Movie Images API Reference</a>
 * @see <a href="https://developer.themoviedb.org/reference/tv-series-images">TV Series Images API Reference</a>
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImagesModel {

  private long id;
  private List<Image> backdrops;
  private List<Image> posters;
  private List<Image> logos;
}
