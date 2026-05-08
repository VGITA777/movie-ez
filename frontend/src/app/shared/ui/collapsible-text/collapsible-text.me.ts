import { Component, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { NgClass } from '@angular/common';

@Component({
  selector: 'me-collapsible-text',
  imports: [HlmButtonImports, NgClass],
  templateUrl: './collapsible-text.me.html',
  styleUrl: './collapsible-text.me.css',
})
export class CollapsibleTextMe {
  public readonly text: InputSignal<string> = input.required();
  public readonly lines: InputSignal<number> = input(3);
  public readonly textClass: InputSignal<string> = input('');

  protected readonly isExpanded: WritableSignal<boolean> = signal(false);

  protected toggleTextClamp(): void {
    this.isExpanded.update((value) => !value);
  }
}
