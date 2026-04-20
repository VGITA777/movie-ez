package dev.prince.movieez.media.api.models.tvseries;

import dev.prince.movieez.media.api.models.shared.Page;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Response model for The Movie Database (TMDB) API's TV series recommendations endpoint. Contains a paginated list of
 * TV series that are recommended based on the specified TV series.
 *
 * @see <a href="https://developer.themoviedb.org/reference/tv-series-recommendations">TV Series Recommendations API
 * Reference</a>
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class TvSeriesRecommendationsModel extends Page<TvSeriesShortDetailsModelWithMediaTypeModel> {

}
