import {Injectable} from '@angular/core';
import {TMDB} from 'tmdb-ts';
import {environment} from '../../../environments/environment';
import {
  AccountEndpoint,
  CertificationEndpoint,
  ChangeEndpoint,
  CollectionsEndpoint,
  ConfigurationEndpoint,
  CreditsEndpoint,
  DiscoverEndpoint,
  FindEndpoint,
  GenreEndpoint,
  KeywordsEndpoint,
  MoviesEndpoint,
  PeopleEndpoint,
  ReviewEndpoint,
  SearchEndpoint,
  TrendingEndpoint,
  TvEpisodesEndpoint,
  TvSeasonsEndpoint,
  TvShowsEndpoint,
  WatchProvidersEndpoint
} from 'tmdb-ts/dist/endpoints';
import {CompaniesEndpoint} from 'tmdb-ts/dist/endpoints/companies';
import {NetworksEndpoint} from 'tmdb-ts/dist/endpoints/networks';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private readonly apiKey: string = environment.apiKey;
  private readonly tmdb: TMDB = new TMDB(this.apiKey);

  private readonly _endpoints = {
    account: this.tmdb.account,
    configuration: this.tmdb.configuration,
    certifications: this.tmdb.certifications,
    changes: this.tmdb.changes,
    credits: this.tmdb.credits,
    companies: this.tmdb.companies,
    networks: this.tmdb.networks,
    search: this.tmdb.search,
    genres: this.tmdb.genres,
    movies: this.tmdb.movies,
    tvShows: this.tmdb.tvShows,
    tvEpisode: this.tmdb.tvEpisode,
    discover: this.tmdb.discover,
    people: this.tmdb.people,
    review: this.tmdb.review,
    trending: this.tmdb.trending,
    find: this.tmdb.find,
    keywords: this.tmdb.keywords,
    collections: this.tmdb.collections,
    tvSeasons: this.tmdb.tvSeasons,
    watchProviders: this.tmdb.watchProviders
  };

  get account(): AccountEndpoint {
    return this._endpoints.account;
  }

  get configuration(): ConfigurationEndpoint {
    return this._endpoints.configuration;
  }

  get certifications(): CertificationEndpoint {
    return this._endpoints.certifications;
  }

  get changes(): ChangeEndpoint {
    return this._endpoints.changes;
  }

  get credits(): CreditsEndpoint {
    return this._endpoints.credits;
  }

  get companies(): CompaniesEndpoint {
    return this._endpoints.companies;
  }

  get networks(): NetworksEndpoint {
    return this._endpoints.networks;
  }

  get search(): SearchEndpoint {
    return this._endpoints.search;
  }

  get genres(): GenreEndpoint {
    return this._endpoints.genres;
  }

  get movies(): MoviesEndpoint {
    return this._endpoints.movies;
  }

  get tvShows(): TvShowsEndpoint {
    return this._endpoints.tvShows;
  }

  get tvEpisode(): TvEpisodesEndpoint {
    return this._endpoints.tvEpisode;
  }

  get discover(): DiscoverEndpoint {
    return this._endpoints.discover;
  }

  get people(): PeopleEndpoint {
    return this._endpoints.people;
  }

  get review(): ReviewEndpoint {
    return this._endpoints.review;
  }

  get trending(): TrendingEndpoint {
    return this._endpoints.trending;
  }

  get find(): FindEndpoint {
    return this._endpoints.find;
  }

  get keywords(): KeywordsEndpoint {
    return this._endpoints.keywords;
  }

  get collections(): CollectionsEndpoint {
    return this._endpoints.collections;
  }

  get tvSeasons(): TvSeasonsEndpoint {
    return this._endpoints.tvSeasons;
  }

  get watchProviders(): WatchProvidersEndpoint {
    return this._endpoints.watchProviders;
  }
}
