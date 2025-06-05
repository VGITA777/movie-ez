import {MediaLinkProvider} from '../../shared/watch-provider/media-link-provider';
import {MovieDetails, TvShowDetails} from 'tmdb-ts';
import {computed, inject, resource, ResourceRef, Signal, WritableSignal} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {TmdbService} from '../../shared/data-access/tmdb.service';

export interface MovieGenericMediaInfo {
  id: number
}

export interface TvShowGenericMediaInfo extends MovieGenericMediaInfo {
  season: number,
  episode: number
}

export abstract class WatchPage<P extends MediaLinkProvider, I extends MovieGenericMediaInfo, D extends MovieDetails | TvShowDetails> {
  protected readonly domSanitizer: DomSanitizer = inject(DomSanitizer);
  protected readonly tmdb: TmdbService = inject(TmdbService);

  protected abstract readonly mediaLinkProvider: WritableSignal<P>;
  protected abstract readonly genericMediaInfo: Signal<I>;
  protected readonly mediaResourceUrl: Signal<SafeResourceUrl> = computed(() => {
    const mediaInformation = this.genericMediaInfo();
    return this.domSanitizer.bypassSecurityTrustResourceUrl(this.mediaLinkProvider().provideLink(mediaInformation.id));
  })
  protected readonly mediaDetails: ResourceRef<D> = resource({
    defaultValue: {} as D,
    params: () => {
      return {id: this.genericMediaInfo().id}
    },
    loader: (data) => this.loader(data.params.id)
  })

  protected abstract loader(id: number): Promise<D>;
}
