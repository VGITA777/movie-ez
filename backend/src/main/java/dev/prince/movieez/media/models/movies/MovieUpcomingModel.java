package dev.prince.movieez.media.models.movies;

import dev.prince.movieez.media.models.shared.Page;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Model representing the TMDB "Upcoming" movies list response.
 *
 * @see <a href="https://developer.themoviedb.org/reference/movie-upcoming-list">Movie Upcoming API Reference</a>
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class MovieUpcomingModel extends Page<MovieShortDetailsWithMediaTypeModel> {

}

