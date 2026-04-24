package dev.prince.movieez.media.models.tvseries;

import dev.prince.movieez.media.models.shared.Page;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Response model for The Movie Database (TMDB) API's TV series similar endpoint. Contains a paginated list of TV series
 * that are similar to the specified TV series.
 *
 * @see <a href="https://developer.themoviedb.org/reference/tv-series-similar">TV Series Similar API Reference</a>
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class TvSeriesSimilarModel extends Page<TvSeriesShortDetailsModelWithMediaTypeModel> {

}
