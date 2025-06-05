import {Component, effect, inject} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';

@Component({
  selector: 'app-watch-tv',
  imports: [],
  templateUrl: './watch-tv.component.html',
  styleUrl: './watch-tv.component.scss'
})
export class WatchTvComponent {
  protected readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  protected readonly tvMediaInformation = toSignal(
    this.activatedRoute.paramMap.pipe(
      map((params: ParamMap) => {
        return {
          id: params.get('id') ?? '',
          season: Number(params.get('season')) || 1,
          episode: Number(params.get('episode')) || 1
        }
      })
    ),
    {initialValue: {} as { id: string, season: number, episode: number }}
  );


  constructor() {
    effect(() => {
      console.log(this.tvMediaInformation())
    });
  }

}
