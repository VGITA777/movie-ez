/*
 * Copyright (c) 2025. This code is created by Prince Angelo Coquia.
 */

import {Component, inject, signal, Signal} from '@angular/core';
import {MOVIE_EMBED_OBJS, MovieMediaLinkProvider,} from '@shared/watch-provider/media-link-provider';
import {MovieDetails, Recommendations} from 'tmdb-ts';
import {MovieGenericMediaInfo, WatchPage} from '../../data-access/watch-page';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {VideoSource} from '@constants';
import {DropDownSelectComponent} from '@ui/drop-down-select/drop-down-select.component';
import {MediaLike, MediaSliderComponent} from '@ui/media-slider/media-slider.component';
import {NavigatorService} from '@utils/navigator.service';
import {DeviceSizeService} from '@utils/device-size.service';
import {MediaSliderSkeletonComponent} from '@ui/media-slider-skeleton/media-slider-skeleton.component';

@Component({
  selector: 'app-watch-movie',
  imports: [
    DropDownSelectComponent,
    MediaSliderComponent,
    MediaSliderSkeletonComponent
  ],
  templateUrl: './watch-movie.component.html',
  styleUrl: './watch-movie.component.scss'
})
export class WatchMovieComponent extends WatchPage<MovieMediaLinkProvider, MovieGenericMediaInfo, MovieDetails> {

  protected readonly deviceSizeService: DeviceSizeService = inject(DeviceSizeService);
  protected override mediaLinkProviders: Signal<Record<VideoSource, MovieMediaLinkProvider>> = signal(MOVIE_EMBED_OBJS);
  protected override readonly genericMediaInfo: Signal<MovieGenericMediaInfo> = toSignal(
    this.activatedRoute.paramMap.pipe(map((params): MovieGenericMediaInfo => ({id: Number(params.get('id')) ?? 0}))),
    {initialValue: {} as MovieGenericMediaInfo}
  )
  private readonly navigatorService: NavigatorService = inject(NavigatorService);

  handleOnCardClick($event: MediaLike) {
    this.navigatorService.navigateToWatch($event);
  }

  protected override mediaDetailsLoader(id: number): Promise<MovieDetails> {
    return this.tmdb.movies.details(id);
  }

  protected override mediaRecommendationsLoader(id: number): Promise<Recommendations> {
    return this.tmdb.movies.recommendations(id);
  }
}
