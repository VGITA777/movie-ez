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
import {IconInputFieldComponent} from '../shared/ui/icon-input-field/icon-input-field.component';
import {ShineCardComponent} from '../shared/ui/shine-card/shine-card.component';
import {TmdbService} from '../shared/data-access/tmdb.service';
import {MultiSearchResult, Search} from 'tmdb-ts';
import {MediaCardComponent} from '../shared/ui/media-card/media-card.component';
import {environment} from '../../environments/environment';
import {ShineCardGroupDirective} from '../shared/directives/shine-card-group.directive';
import {WatchNavigationHandler} from '../shared/utils/navigator.service';
import {SkeletonComponent} from '../shared/ui/skeleton/skeleton.component';
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
  readonly isLoading: Signal<boolean> = computed(() => this.searchResults.isLoading());
  readonly searchResults: ResourceRef<Search<MultiSearchResult>> = resource({
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
  readonly hasResults: Signal<boolean> = computed(() => this.searchResults.value().total_results > 0 && !this.isLoading() && this.hasSearched());
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
