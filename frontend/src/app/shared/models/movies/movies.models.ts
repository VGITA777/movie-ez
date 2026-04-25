import {
  Keywords,
  MediaDetailsModel,
  MediaShortDetailsModel,
  MediaType,
  Page,
} from '@shared/models';

export interface MovieAlternativeTitle {
  iso_3166_1: string;
  title: string;
  type: string | null;
}

export interface MovieAlternativeTitlesModel {
  id: number;
  titles: MovieAlternativeTitle[];
}

export interface MovieBelongsToCollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

export interface MovieDetailsModel extends MediaDetailsModel {
  belongs_to_collection: MovieBelongsToCollection;
  budget: number;
  imdb_id: string;
  original_title: string;
  release_date: string;
  revenue: number;
  runtime: number;
  title: string;
  video: boolean;
  media_type: MediaType;
}

export interface MovieLatestModel extends MovieDetailsModel {}

export interface MovieShortDetailsModel extends MediaShortDetailsModel {
  adult: boolean;
  title: string;
  original_title: string;
  release_date: string;
  video: boolean;
}

export interface MovieShortDetailsWithMediaTypeModel extends MovieShortDetailsModel {
  media_type: MediaType;
}

export interface MovieKeywordsModel extends Keywords {}

export interface MovieRecommendationsModel extends Page<MovieShortDetailsWithMediaTypeModel> {}

export interface MovieSimilarModel extends Page<MovieShortDetailsWithMediaTypeModel> {}
