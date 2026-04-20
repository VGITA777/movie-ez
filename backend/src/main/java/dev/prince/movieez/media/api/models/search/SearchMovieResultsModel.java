package dev.prince.movieez.media.api.models.search;

import dev.prince.movieez.media.api.models.movies.MovieShortDetailsWithMediaTypeModel;
import dev.prince.movieez.media.api.models.shared.Page;
import lombok.Data;
import lombok.EqualsAndHashCode;


@Data
@EqualsAndHashCode(callSuper = true)
public class SearchMovieResultsModel extends Page<MovieShortDetailsWithMediaTypeModel> {

}
