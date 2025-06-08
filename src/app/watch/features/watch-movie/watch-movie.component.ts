import {Component, inject, signal, Signal} from '@angular/core';
import {MOVIE_EMBED_OBJS, MovieMediaLinkProvider,} from '../../../shared/watch-provider/media-link-provider';
import {MovieDetails, Recommendations} from 'tmdb-ts';
import {MovieGenericMediaInfo, WatchPage} from '../../data-access/watch-page';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {VideoSource} from '../../../shared/constants';
import {DropDownSelectComponent} from '../../../shared/ui/drop-down-select/drop-down-select.component';
import {MediaLike, MediaSliderComponent} from '../../../shared/ui/media-slider/media-slider.component';
import {NavigatorService} from '../../../shared/utils/navigator.service';

@Component({
  selector: 'app-watch-movie',
  imports: [
    DropDownSelectComponent,
    MediaSliderComponent
  ],
  templateUrl: './watch-movie.component.html',
  styleUrl: './watch-movie.component.scss'
})
export class WatchMovieComponent extends WatchPage<MovieMediaLinkProvider, MovieGenericMediaInfo, MovieDetails> {

  private readonly navigatorService: NavigatorService = inject(NavigatorService);
  protected override mediaLinkProviders: Signal<Record<VideoSource, MovieMediaLinkProvider>> = signal(MOVIE_EMBED_OBJS);
  protected override readonly genericMediaInfo: Signal<MovieGenericMediaInfo> = toSignal(
    this.activatedRoute.paramMap.pipe(map((params): MovieGenericMediaInfo => ({id: Number(params.get('id')) ?? 0}))),
    {initialValue: {} as MovieGenericMediaInfo}
  )

  protected override mediaDetailsLoader(id: number): Promise<MovieDetails> {
    return this.tmdb.movies.details(id);
  }

  protected override mediaRecommendationsLoader(id: number): Promise<Recommendations> {
    return this.tmdb.movies.recommendations(id);
  }

  handleOnCardClick($event: MediaLike) {
    this.navigatorService.navigateToWatch($event);
  }
}
