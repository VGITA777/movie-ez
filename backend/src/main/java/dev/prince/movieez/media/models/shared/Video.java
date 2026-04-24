package dev.prince.movieez.media.models.shared;

import lombok.Data;

/**
 * Model representing a video in The Movie Database (TMDB) API. Contains information about a video such as its key,
 * site, type, etc.
 *
 * @see <a href="https://developer.themoviedb.org/reference/movie-videos">Movie Videos API Reference</a>
 * @see <a href="https://developer.themoviedb.org/reference/tv-series-videos">TV Series Videos API Reference</a>
 */
@Data
public class Video {

  private String iso_639_1;
  private String iso_3166_1;
  private String name;
  private String key;
  private String site;
  private int size;
  private String type;
  private boolean official;
  private String published_at;
  private String id;
}
