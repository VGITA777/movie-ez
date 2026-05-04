package dev.prince.movieez.media.models.tvseries;

import dev.prince.movieez.media.models.shared.Page;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Model representing the TMDB "Airing Today" TV series list response.
 *
 * @see <a href="https://developer.themoviedb.org/reference/tv-series-airing-today">TV Series Airing Today API Reference</a>
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class TvSeriesAiringTodayModel extends Page<TvSeriesShortDetailsWithMediaTypeModel> {

}

