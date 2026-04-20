import {Routes} from '@angular/router';
import {AiringTodayTvShowsResolverService} from './data-access/airing-today-tv-shows-resolver.service';
import {OnTheAirTvShowsResolverService} from './data-access/on-the-air-tv-shows-resolver.service';
import {TopRatedTvShowsResolverService} from './data-access/top-rated-tv-shows-resolver.service';
import {PopularTvShowResolverService} from '../shared/data-access/popular-tv-show-resolver.service';

export const TvShowsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tv-shows.component').then(m => m.TvShowsComponent),
    resolve: {
      airingTodayTvSeries: AiringTodayTvShowsResolverService,
      onTheAirTvSeries: OnTheAirTvShowsResolverService,
      topRatedTvSeries: TopRatedTvShowsResolverService,
      popularTvShows: PopularTvShowResolverService
    }
  }
];
