import {
  Keyword,
  MediaDetailsModel,
  MediaShortDetailsModel,
  MediaType,
  Page,
} from '@shared/models';

export interface TvSeriesCreatedBy {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string;
}

export interface TvSeriesEpisodeToAir {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: string;
  still_path: string;
  vote_average: number;
  vote_count: number;
}

export interface TvSeriesNetwork {
  id: number;
  name: string;
  logo_path: string;
  origin_country: string;
}

export interface TvSeriesSeason {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

export interface TvSeriesDetailsModel extends MediaDetailsModel {
  first_air_date: string;
  created_by: TvSeriesCreatedBy[];
  episode_run_time: number[];
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: TvSeriesEpisodeToAir;
  name: string;
  next_episode_to_air: TvSeriesEpisodeToAir;
  networks: TvSeriesNetwork[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_name: string;
  seasons: TvSeriesSeason[];
  type: string;
  media_type: MediaType;
}

export interface TvSeriesLatestModel extends TvSeriesDetailsModel {}

export interface TvSeriesShortDetailsModel extends MediaShortDetailsModel {
  name: string;
  original_name: string;
  first_air_date: string;
  origin_country: string[];
}

export interface TvSeriesShortDetailsModelWithMediaTypeModel extends TvSeriesShortDetailsModel {
  media_type: MediaType;
}

export interface TvSeriesKeywordsModel {
  id: number;
  keywords: Keyword[];
}

export interface TvSeriesRecommendationsModel extends Page<TvSeriesShortDetailsModelWithMediaTypeModel> {}

export interface TvSeriesSimilarModel extends Page<TvSeriesShortDetailsModelWithMediaTypeModel> {}
