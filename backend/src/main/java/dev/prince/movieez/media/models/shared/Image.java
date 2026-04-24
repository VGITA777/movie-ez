package dev.prince.movieez.media.models.shared;

import lombok.Data;

/**
 * Model representing an image in The Movie Database (TMDB) API. Contains information about an image such as its file
 * path, dimensions, and vote statistics.
 *
 * @see <a href="https://developer.themoviedb.org/reference/movie-images">Movie Images API Reference</a>
 * @see <a href="https://developer.themoviedb.org/reference/tv-series-images">TV Series Images API Reference</a>
 */
@Data
public class Image {

  private double aspect_ratio;
  private String file_path;
  private int height;
  private String iso_639_1;
  private double vote_average;
  private int vote_count;
  private int width;
}
