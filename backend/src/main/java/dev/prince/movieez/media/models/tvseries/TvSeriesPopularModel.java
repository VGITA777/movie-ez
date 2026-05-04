package dev.prince.movieez.media.models.tvseries;

import dev.prince.movieez.media.models.shared.Page;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Model representing the TMDB "Popular" TV series list response.
 *
 * @see <a href="https://developer.themoviedb.org/reference/tv-series-popular">TV Series Popular API Reference</a>
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class TvSeriesPopularModel extends Page<TvSeriesShortDetailsWithMediaTypeModel> {

}

