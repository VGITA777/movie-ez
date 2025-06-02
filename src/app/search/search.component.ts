import {Component, signal, WritableSignal} from '@angular/core';
import {IconInputFieldComponent} from '../shared/ui/icon-input-field/icon-input-field.component';
import {ShineCardComponent} from '../shared/ui/shine-card/shine-card.component';

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

  readonly searchText: WritableSignal<string> = signal('');

  search(event: string) {
    this.searchText.set(event);
  }
}
