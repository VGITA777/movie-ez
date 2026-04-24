package dev.prince.movieez.media.models.shared;

import lombok.Data;

/**
 * Represents a genre for movies and TV series. This is a shared model used by both movie and TV series responses.
 *
 * @see <a href="https://developer.themoviedb.org/reference/genre-movie-list">Movie Genres API Reference</a>
 * @see <a href="https://developer.themoviedb.org/reference/genre-tv-list">TV Series Genres API Reference</a>
 */
@Data
public class Genre {

  private long id;
  private String name;
}
