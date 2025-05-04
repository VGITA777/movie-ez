import {Routes} from '@angular/router';
import {WatchMovieComponent} from './features/watch-movie/watch-movie.component';

export const WatchRoutes: Routes = [
  {
    path: 'movie/:id',
    component: WatchMovieComponent
  },
  {
    path: 'series/:id',
    component: WatchMovieComponent
  }
]
