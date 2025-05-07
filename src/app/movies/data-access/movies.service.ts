import {Injectable} from '@angular/core';
import {TmdbService} from '../../shared/data-access/tmdb.service';
import {MoviesEndpoint} from 'tmdb-ts/dist/endpoints';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private readonly moviesEndpoint: MoviesEndpoint;

  constructor(readonly tmdb: TmdbService) {
    this.moviesEndpoint = this.tmdb.movies;
  }

  getPopular(page: number = 1) {
    return this.moviesEndpoint.popular({
      page: page,
    })
  }

  getTopRated(page: number = 1) {
    return this.moviesEndpoint.topRated({
      page: page,
    })
  }

  getNowPlaying(page: number = 1) {
    return this.moviesEndpoint.nowPlaying({
      page: page,
    })
  }

  getLatest() {
    return this.moviesEndpoint.latest()
  }
}
