package dev.prince.movieez.media.models.movies;

import dev.prince.movieez.media.models.shared.MediaShortDetailsModel;
import dev.prince.movieez.media.models.shared.Page;

/**
 * Model for the response of the
 * <a href="https://developer.themoviedb.org/reference/movie-similar">Similar Movies</a> endpoint.
 * Extends {@link Page} of {@link MediaShortDetailsModel}.
 *
 * @see <a href="https://developer.themoviedb.org/reference/movie-similar">Movie Similar API Reference</a>
 */
public class MovieSimilarModel extends Page<MovieShortDetailsWithMediaTypeModel> {

}
