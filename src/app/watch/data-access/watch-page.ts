import {MediaLinkProvider, TvMediaLinkProvider} from '../../shared/watch-provider/media-link-provider';
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

export type GenericMediaInfo = MovieGenericMediaInfo | TvShowGenericMediaInfo;

export abstract class WatchPage<P extends MediaLinkProvider, I extends GenericMediaInfo, D extends MovieDetails | TvShowDetails> {
  protected readonly domSanitizer: DomSanitizer = inject(DomSanitizer);
  protected readonly tmdb: TmdbService = inject(TmdbService);

  protected abstract readonly mediaLinkProvider: WritableSignal<P>;
  protected abstract readonly genericMediaInfo: Signal<I>;
  protected readonly mediaDetails: ResourceRef<D> = resource({
    defaultValue: {} as D,
    params: () => ({id: this.genericMediaInfo().id}),
    loader: (data) => this.loader(data.params.id)
  });
  protected readonly mediaResourceUrl: Signal<SafeResourceUrl> = computed(() => {
    const mediaInformation = this.genericMediaInfo();
    if ('season' in mediaInformation && 'episode' in mediaInformation && this.mediaLinkProvider() instanceof TvMediaLinkProvider) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(
        this.mediaLinkProvider().provideLink(mediaInformation.id, mediaInformation.season, mediaInformation.episode)
      );
    }
    return this.domSanitizer.bypassSecurityTrustResourceUrl(this.mediaLinkProvider().provideLink(mediaInformation.id));
  });

  protected abstract loader(id: number): Promise<D>;
}
