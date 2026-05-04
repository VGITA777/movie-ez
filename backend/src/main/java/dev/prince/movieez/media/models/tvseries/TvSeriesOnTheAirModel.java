package dev.prince.movieez.media.models.tvseries;

import dev.prince.movieez.media.models.shared.Page;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Model representing the TMDB "On The Air" TV series list response.
 *
 * @see <a href="https://developer.themoviedb.org/reference/tv-series-on-the-air">TV Series On The Air API Reference</a>
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class TvSeriesOnTheAirModel extends Page<TvSeriesShortDetailsWithMediaTypeModel> {

}

