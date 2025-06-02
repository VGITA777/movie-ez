import {Component, inject, model, ModelSignal, resource, ResourceRef, signal, WritableSignal} from '@angular/core';
import {IconInputFieldComponent} from '../shared/ui/icon-input-field/icon-input-field.component';
import {ShineCardComponent} from '../shared/ui/shine-card/shine-card.component';
import {TmdbService} from '../shared/data-access/tmdb.service';
import {MultiSearchResult, Search} from 'tmdb-ts';

@Component({
  selector: 'app-search',
  imports: [
    IconInputFieldComponent,
    ShineCardComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  readonly searchText: ModelSignal<string> = model('');
  readonly debouncedSearchText: WritableSignal<string> = signal('');
  private readonly tmdb: TmdbService = inject(TmdbService);
  readonly searchResults: ResourceRef<Search<MultiSearchResult> | undefined> = resource({
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

  search(event: string) {
    this.debouncedSearchText.set(event);
  }
}
