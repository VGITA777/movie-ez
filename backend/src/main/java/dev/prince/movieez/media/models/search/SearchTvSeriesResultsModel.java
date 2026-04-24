package dev.prince.movieez.media.models.search;

import dev.prince.movieez.media.models.shared.Page;
import dev.prince.movieez.media.models.tvseries.TvSeriesShortDetailsModelWithMediaTypeModel;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class SearchTvSeriesResultsModel extends Page<TvSeriesShortDetailsModelWithMediaTypeModel> {

}
