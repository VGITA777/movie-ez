import {Component, inject, model, ModelSignal, resource, ResourceRef, signal, WritableSignal} from '@angular/core';
import {IconInputFieldComponent} from '../shared/ui/icon-input-field/icon-input-field.component';
import {ShineCardComponent} from '../shared/ui/shine-card/shine-card.component';
import {TmdbService} from '../shared/data-access/tmdb.service';
import {MultiSearchResult, Search} from 'tmdb-ts';
import {MediaCardComponent} from '../shared/ui/media-card/media-card.component';
import {environment} from '../../environments/environment';
import {ShineCardGroupDirective} from '../shared/directives/shine-card-group.directive';
import {Skeleton} from 'primeng/skeleton';

@Component({
  selector: 'app-search',
  imports: [
    IconInputFieldComponent,
    ShineCardComponent,
    MediaCardComponent,
    ShineCardGroupDirective,
    Skeleton
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  readonly searchText: ModelSignal<string> = model('');
  readonly debouncedSearchText: WritableSignal<string> = signal('');
  readonly searchResults: ResourceRef<Search<any>> = resource({
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

  protected readonly environment = environment;
  private readonly tmdb: TmdbService = inject(TmdbService);

  search(event: string) {
    this.debouncedSearchText.set(event);
  }

  protected handleClearSearchText() {
    this.searchText.set('');
  }
}
