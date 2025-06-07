import {MediaLinkProvider, TvMediaLinkProvider} from '../../shared/watch-provider/media-link-provider';
import {MovieDetails, TvShowDetails} from 'tmdb-ts';
import {computed, inject, linkedSignal, resource, ResourceRef, Signal, WritableSignal} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {TmdbService} from '../../shared/data-access/tmdb.service';
import {VideoSource} from '../../shared/constants';
import {Option} from '../../shared/ui/drop-down-select/drop-down-select.component';

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
  protected readonly defaultVideoSource: VideoSource = 'vidora';

  // Abstract properties to be implemented by subclasses
  protected abstract readonly mediaLinkProviders: Signal<Record<VideoSource, P>>
  protected abstract readonly genericMediaInfo: Signal<I>;

  // Media Link Provider Options
  protected readonly mediaLinkProviderOptions: Signal<Option[]> = computed((): Option[] =>
    Object.keys(this.mediaLinkProviders()).map(provider => ({label: provider, value: provider}))
  );
  protected readonly selectedMediaLinkProvider: WritableSignal<Option> = linkedSignal({
    source: this.mediaLinkProviderOptions,
    computation: () => this.mediaLinkProviderOptions()
      .find(d => d.value === this.defaultVideoSource) ?? {
      label: this.defaultVideoSource,
      value: this.defaultVideoSource
    }
  });

  // Current media link provider based on the selected option
  protected readonly mediaLinkProvider: Signal<P> = computed(() => {
    const videoSource: VideoSource = this.selectedMediaLinkProvider().value as VideoSource ?? this.defaultVideoSource;
    return this.mediaLinkProviders()[videoSource];
  })

  // Search Media Information about the current media based on the ID
  protected readonly mediaDetails: ResourceRef<D> = resource({
    defaultValue: {} as D,
    params: () => ({id: this.genericMediaInfo().id}),
    loader: (data) => this.loader(data.params.id)
  });

  // Convert the media information into a safe resource URL
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
