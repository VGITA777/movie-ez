import {Component, signal, WritableSignal} from '@angular/core';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-loading',
  imports: [
    NgStyle
  ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
}
