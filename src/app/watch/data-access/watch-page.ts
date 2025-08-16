/*
 * Copyright (c) 2025. This code is created by Prince Angelo Coquia.
 */

import {MediaLinkProvider, TvMediaLinkProvider} from '../../shared/watch-provider/media-link-provider';
import {Genre, MovieDetails, Recommendation, Recommendations, TvShowDetails} from 'tmdb-ts';
import {computed, inject, linkedSignal, resource, ResourceRef, Signal, WritableSignal} from '@angular/core';
import {TmdbService} from '../../shared/data-access/tmdb.service';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {VideoSource} from '../../shared/constants';
import {Option} from '../../shared/ui/drop-down-select/drop-down-select.component';
import {environment} from '../../../environments/environment';

/**
 * Typically used for Movies.
 * */
export interface MovieGenericMediaInfo {
  id: number
}

/**
 * Typically used for TV Series.
 * */
export interface TvShowGenericMediaInfo extends MovieGenericMediaInfo {
  season: number,
  episode: number
}

export type GenericMediaInfo = MovieGenericMediaInfo | TvShowGenericMediaInfo;

/**
 * Abstracts common functionality for fetching media details based on {@link GenericMediaInfo}.
 * Includes, {@link MovieDetails} or {@link TvShowDetails}, {@link Recommendations} and other related data.
 *
 * @template I - can be {@link MovieGenericMediaInfo} or {@link TvShowGenericMediaInfo}.
 * @template D - can be {@link MovieDetails} or {@link TvShowDetails}.
 * */
export abstract class MediaDetailsPage<I extends GenericMediaInfo, D extends MovieDetails | TvShowDetails> {
  protected readonly tmdb: TmdbService = inject(TmdbService);
  protected readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  protected readonly defaultImageSize: string = environment.defaultWatchImageSize;
  /**
   * Media ID extracted from the route/url parameters.
   * */
  protected readonly mediaId: Signal<number> = toSignal(this.activatedRoute.paramMap.pipe(map((params) => Number(params.get('id')) ?? 0)), {initialValue: 0});
  /**
   * Consists of generic info about the media, such as ID, season, and episode
   * which would be used to retrieve data from the api.
   * */
  protected abstract readonly genericMediaInfo: Signal<I>;
  /**
   * Signal-based property that is in charge of fetching the media details
   * based on the generic media info provided by the implementing class.
   * */
  protected readonly mediaDetailsRequest: ResourceRef<D> = resource({
    defaultValue: {} as D,
    params: () => ({id: this.genericMediaInfo().id}),
    loader: (data) => this.mediaDetailsLoader(data.params.id),
    equal: (prev, next) => prev.id === next.id
  });
  /**
   * Results from the media details request.
   * */
  protected readonly mediaDetailsResult: Signal<D> = computed(() => this.mediaDetailsRequest.value());
  // Mapped properties from the media details.
  protected readonly title: Signal<string> = computed(() => {
    const data: D = this.mediaDetailsRequest.value()
    // if title property exists, then it's a movie
    if ('title' in data) {
      return data.title ?? 'Untitled Movie';
    }

    // if title property exists, then it's a TV series
    if ('name' in data) {
      return data.name ?? 'Untitled TV Show';
    }

    return '';
  });
  protected readonly genres: Signal<Genre[]> = computed(() => this.mediaDetailsRequest.value().genres ?? []);
  protected readonly genreStrings: Signal<string[]> = computed(() => this.genres().map(g => g.name));
  protected readonly overview: Signal<string> = computed(() => this.mediaDetailsRequest.value().overview ?? '');
  /**
   * Signal-based property that is in charge of fetching the media recommendations
   * based on the current generic media details.
   * */
  protected readonly mediaRecommendationsRequest: ResourceRef<Recommendations> = resource({
    defaultValue: {} as Recommendations,
    params: () => ({id: this.mediaId()}),
    loader: (data) => this.mediaRecommendationsLoader(data.params.id)
  });
  /**
   * Results from the media recommendations requests.
   * */
  protected readonly mediaRecommendations: Signal<Recommendation[]> = computed(() => this.mediaRecommendationsRequest.value().results)
  private readonly environment = environment;
  protected readonly backdropImageUrl: Signal<string> = computed(() => this.environment.fullImageUrl(this.mediaDetailsRequest.value().backdrop_path ?? '', this.defaultImageSize));
  protected readonly posterImageUrl: Signal<string> = computed(() => this.environment.fullImageUrl(this.mediaDetailsRequest.value().poster_path ?? '', this.defaultImageSize));

  /**
   * In charge of fetching data from the API based on the media ID.
   * */
  protected abstract mediaDetailsLoader(id: number): Promise<D>;

  /**
   * In charge of fetching media recommendations based on the media ID.
   * */
  protected abstract mediaRecommendationsLoader(id: number): Promise<Recommendations>
}

/**
 * Abstracts common functionality for watch pages
 * that deals with media links and media details.
 *
 * @template P - can be {@link MovieMediaLinkProvider} or {@link TvMediaLinkProvider}.
 * @template I - can be {@link MovieGenericMediaInfo} or {@link TvShowGenericMediaInfo}.
 * @template D - can be {@link MovieDetails} or {@link TvShowDetails}.
 * */
export abstract class WatchPage<P extends MediaLinkProvider, I extends GenericMediaInfo, D extends MovieDetails | TvShowDetails> extends MediaDetailsPage<I, D> {
  protected readonly domSanitizer = inject(DomSanitizer);
  /**
   * Can be overridden by the implementing class to provide a default video source.
   * */
  protected readonly defaultVideoSource: VideoSource = 'vidsrc';

  /**
   * Records of media link providers that can be used to provide links for the media.
   * Keys should be a type of {@link VideoSource}
   * */
  protected abstract readonly mediaLinkProviders: Signal<Record<VideoSource, P>>

  /**
   * Maps the media link providers into an array of options.
   * */
  protected readonly mediaLinkProviderOptions: Signal<Option[]> = computed((): Option[] =>
    Object.keys(this.mediaLinkProviders()).map(provider => ({label: provider, value: provider}))
  );

  /**
   * Manages the current media link provider which can either be {@link MovieMediaLinkProvider}
   * or {@link TvMediaLinkProvider} which can be changed by the implementing class (dropdown, selection, etc.).
   * */
  protected selectedMediaLinkProvider: WritableSignal<Option> = linkedSignal({
    source: (): { provider: Option[] } => ({provider: this.mediaLinkProviderOptions()}),
    computation: (newOptions): Option => newOptions.provider
      .find(d => d.value === this.defaultVideoSource) ?? {
      label: this.defaultVideoSource,
      value: this.defaultVideoSource
    }
  });

  /**
   * The current media link provider that is based on the currently selected media link provider.
   * */
  protected readonly mediaLinkProvider: Signal<P> = computed(() => {
    const videoSource: VideoSource = this.selectedMediaLinkProvider().value as VideoSource ?? this.defaultVideoSource;
    return this.mediaLinkProviders()[videoSource];
  })

  /**
   * A safe link to the media resource URL that can be used in the template
   * based on the generic media info (ID, current Season, and Episode) and the media link provider.
   * */
  protected readonly mediaResourceUrl: Signal<SafeResourceUrl> = computed(() => {
    const mediaInformation: I = this.genericMediaInfo();
    if ('season' in mediaInformation && 'episode' in mediaInformation && this.mediaLinkProvider() instanceof TvMediaLinkProvider) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(
        this.mediaLinkProvider().provideLink(mediaInformation.id, mediaInformation.season, mediaInformation.episode)
      );
    }
    return this.domSanitizer.bypassSecurityTrustResourceUrl(this.mediaLinkProvider().provideLink(mediaInformation.id));
  });
}
