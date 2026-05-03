package dev.prince.movieez.media.models.movies;

import dev.prince.movieez.media.models.shared.Page;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Model representing the TMDB "Top Rated" movies list response.
 *
 * @see <a href="https://developer.themoviedb.org/reference/movie-top-rated-list">Movie Top Rated API Reference</a>
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class MovieTopRatedModel extends Page<MovieShortDetailsWithMediaTypeModel> {

}

