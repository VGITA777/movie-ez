package dev.prince.movieez.media.models.movies;

import dev.prince.movieez.media.models.shared.Page;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Model representing the TMDB "Popular" movies list response.
 *
 * @see <a href="https://developer.themoviedb.org/reference/movie-popular-list">Movie Popular API Reference</a>
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class MoviePopularModel extends Page<MovieShortDetailsModel> {

}

