/*
 * Copyright (c) 2025. This code is created by Prince Angelo Coquia.
 */

import {
  Component,
  computed,
  inject,
  model,
  ModelSignal,
  resource,
  ResourceRef,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import {IconInputFieldComponent} from '@ui/icon-input-field/icon-input-field.component';
import {ShineCardComponent} from '@ui/shine-card/shine-card.component';
import {TmdbService} from '@shared/data-access/tmdb.service';
import {MultiSearchResult, Search} from 'tmdb-ts';
import {MediaCardComponent} from '@ui/media-card/media-card.component';
import {environment} from '@env/environment';
import {ShineCardGroupDirective} from '@shared/directives/shine-card-group.directive';
import {WatchNavigationHandler} from '@utils/navigator.service';
import {SkeletonComponent} from '@ui/skeleton/skeleton.component';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-search',
  imports: [
    IconInputFieldComponent,
    ShineCardComponent,
    MediaCardComponent,
    ShineCardGroupDirective,
    SkeletonComponent,
    NgStyle
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent extends WatchNavigationHandler {
  readonly searchText: ModelSignal<string> = model('');
  readonly debouncedSearchText: WritableSignal<string> = signal('');
  readonly hasSearched: Signal<boolean> = computed(() => this.debouncedSearchText() !== '');
  protected readonly environment = environment;
  readonly searchRequest: ResourceRef<Search<MultiSearchResult>> = resource({
    defaultValue: {} as Search<MultiSearchResult>,
    params: () => {
      return {
        query: this.debouncedSearchText()
      }
    },
    loader: (resource) => this.tmdb.search.multi({
      query: resource.params.query
    })
  })
  readonly isLoading: Signal<boolean> = computed(() => this.searchRequest.isLoading());
  readonly hasResults: Signal<boolean> = computed(() => this.searchResults().length > 0 && !this.isLoading() && this.hasSearched());
  readonly searchResults: Signal<MultiSearchResult[]> = computed(() => this.searchRequest.value().results.filter(r => {

    if (r.id === null || r.media_type === null) {
      return false;
    }

    if (r.media_type === 'tv') {
      return r.poster_path !== null && r.name !== '';
    }

    if (r.media_type === 'movie') {
      return r.poster_path !== null && r.title !== '';
    }

    return r.media_type !== 'person';
  }));
  private readonly tmdb: TmdbService = inject(TmdbService);

  search(event: string) {
    this.debouncedSearchText.set(event);
  }

  handleCardClick(searchItem: MultiSearchResult) {
    if (searchItem.media_type === 'person') {
      return;
    }
    this.handleNavigation(searchItem);
  }

  protected handleClearSearchText() {
    this.searchText.set('');
  }
}
