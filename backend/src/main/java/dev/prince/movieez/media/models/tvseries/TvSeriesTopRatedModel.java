package dev.prince.movieez.media.models.tvseries;

import dev.prince.movieez.media.models.shared.Page;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Model representing the TMDB "Top Rated" TV series list response.
 *
 * @see <a href="https://developer.themoviedb.org/reference/tv-series-top-rated">TV Series Top Rated API Reference</a>
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class TvSeriesTopRatedModel extends Page<TvSeriesShortDetailsModelWithMediaTypeModel> {

}

