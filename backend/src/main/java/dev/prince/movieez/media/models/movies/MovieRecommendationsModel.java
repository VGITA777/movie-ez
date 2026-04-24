package dev.prince.movieez.media.models.movies;

import dev.prince.movieez.media.models.shared.Page;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Model representing movie recommendations. TMDB Movie Recommendations API Documentation
 *
 * @see <a href="https://developer.themoviedb.org/reference/movie-recommendations">Movie Recommendations API
 * Reference</a>
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class MovieRecommendationsModel extends Page<MovieShortDetailsWithMediaTypeModel> {

}
