package dev.prince.movieez.media.models.movies;

import dev.prince.movieez.media.models.shared.Page;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Model representing the TMDB "Now Playing" movies list response.
 *
 * @see <a href="https://developer.themoviedb.org/reference/movie-now-playing-list">Movie Now Playing API Reference</a>
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class MovieNowPlayingModel extends Page<MovieShortDetailsModel> {

}

