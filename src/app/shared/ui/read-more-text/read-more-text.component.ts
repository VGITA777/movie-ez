import {Component, input, InputSignal, signal, WritableSignal} from '@angular/core';
import {NgClass, NgStyle} from '@angular/common';

@Component({
  selector: 'app-read-more-text',
  imports: [
    NgClass,
    NgStyle
  ],
  templateUrl: './read-more-text.component.html',
  styleUrl: './read-more-text.component.scss'
})
export class ReadMoreTextComponent {
  readonly width: InputSignal<string> = input('unset');
  readonly headerText: InputSignal<string> = input('');
  readonly headerTextSize: InputSignal<string> = input('1.2rem');
  readonly headerTextWeight: InputSignal<string> = input('600');
  readonly buttonText: InputSignal<string> = input("Read more");
  readonly buttonTextExpanded: InputSignal<string> = input("Read less");
  readonly contentLines: InputSignal<number> = input(3);
  readonly contentTextAlign: InputSignal<string> = input('left');
  readonly contentTextSize: InputSignal<string> = input('.9rem');
  readonly contentLetterSpacing: InputSignal<string> = input('1px');
  readonly contentFontWeight: InputSignal<string> = input('200');

  protected readonly isExpanded: WritableSignal<boolean> = signal(false);

  toggleExpand(): void {
    this.isExpanded.update(value => !value);
  }
}

