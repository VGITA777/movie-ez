import {Component, inject, signal, Signal, WritableSignal} from '@angular/core';
import {TvShowGenericMediaInfo, WatchPage} from '../../data-access/watch-page';
import {TvMediaLinkProvider, VideasyTvMediaLinkProvider} from '../../../shared/watch-provider/media-link-provider';
import {TvShowDetails} from 'tmdb-ts';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs';

@Component({
  selector: 'app-watch-tv',
  imports: [],
  templateUrl: './watch-tv.component.html',
  styleUrl: './watch-tv.component.scss'
})
export class WatchTvComponent extends WatchPage<TvMediaLinkProvider, TvShowGenericMediaInfo, TvShowDetails> {
  protected readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  protected override mediaLinkProvider: WritableSignal<TvMediaLinkProvider> = signal(new VideasyTvMediaLinkProvider());
  protected override genericMediaInfo: Signal<TvShowGenericMediaInfo> = toSignal(
    this.activatedRoute.paramMap.pipe(map((params): TvShowGenericMediaInfo => ({
        id: Number(params.get('id')) ?? 0,
        season: Number(params.get('season')) ?? 0,
        episode: Number(params.get('episode')) ?? 0
      }))
    ),
    {initialValue: {} as TvShowGenericMediaInfo}
  );

  protected override loader(id: number): Promise<TvShowDetails> {
    return this.tmdb.tvShows.details(id);
  }
}
