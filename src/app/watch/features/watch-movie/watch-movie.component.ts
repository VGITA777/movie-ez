import {Component, inject, signal, Signal} from '@angular/core';
import {MOVIE_EMBED_OBJS, MovieMediaLinkProvider,} from '../../../shared/watch-provider/media-link-provider';
import {MovieDetails} from 'tmdb-ts';
import {MovieGenericMediaInfo, WatchPage} from '../../data-access/watch-page';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {VideoSource} from '../../../shared/constants';

@Component({
  selector: 'app-watch-movie',
  imports: [],
  templateUrl: './watch-movie.component.html',
  styleUrl: './watch-movie.component.scss'
})
export class WatchMovieComponent extends WatchPage<MovieMediaLinkProvider, MovieGenericMediaInfo, MovieDetails> {
  protected readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  protected override mediaLinkProviders: Signal<Record<VideoSource, MovieMediaLinkProvider>> = signal(MOVIE_EMBED_OBJS);
  protected override readonly genericMediaInfo: Signal<MovieGenericMediaInfo> = toSignal(
    this.activatedRoute.paramMap.pipe(map((params): MovieGenericMediaInfo => ({id: Number(params.get('id')) ?? 0}))),
    {initialValue: {} as MovieGenericMediaInfo}
  )

  protected override loader(id: number): Promise<MovieDetails> {
    return this.tmdb.movies.details(id);
  }
}
