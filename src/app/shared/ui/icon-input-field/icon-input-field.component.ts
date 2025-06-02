import {
  Component,
  effect,
  input,
  InputSignal,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
  Signal
} from '@angular/core';
import {ButtonRoleDirective} from '../../directives/button-role.directive';
import {FormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-icon-input-field',
  imports: [
    ButtonRoleDirective,
    FormsModule
  ],
  templateUrl: './icon-input-field.component.html',
  styleUrl: './icon-input-field.component.scss'
})
export class IconInputFieldComponent {
  readonly text: ModelSignal<string> = model('');
  readonly placeHolder: InputSignal<string> = input('');
  readonly debounceTimeMillis: InputSignal<number> = input(750);
  readonly debouncedText: OutputEmitterRef<string> = output();

  private readonly debouncedTextSignal: Signal<string>;

  constructor() {
    this.debouncedTextSignal = toSignal(toObservable(this.text).pipe(
      distinctUntilChanged(),
      debounceTime(this.debounceTimeMillis())
    ), {initialValue: ''});

    effect(() => {
      this.debouncedText.emit(this.debouncedTextSignal());
    });
  }
}
