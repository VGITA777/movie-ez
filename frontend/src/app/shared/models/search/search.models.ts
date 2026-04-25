import {
  MediaShortDetailsWithMediaTypeModel,
  MovieShortDetailsWithMediaTypeModel,
  Page,
  TvSeriesShortDetailsModelWithMediaTypeModel,
} from '@shared/models';

export interface SearchMultiDataModel extends MediaShortDetailsWithMediaTypeModel {
  title: string;
  original_title: string;
  release_date: string;
  name: string;
  original_name: string;
  first_air_date: string;
}

export interface SearchMultiResultsModel extends Page<SearchMultiDataModel> {}

export interface SearchMovieResultsModel extends Page<MovieShortDetailsWithMediaTypeModel> {}

export interface SearchTvSeriesResultsModel extends Page<TvSeriesShortDetailsModelWithMediaTypeModel> {}
