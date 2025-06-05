import {Component, computed, inject, signal, WritableSignal} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {TvVidoraWatchProvider, TvWatchProvider} from '../../../shared/watch-provider/watch-prover';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-watch-tv',
  imports: [],
  templateUrl: './watch-tv.component.html',
  styleUrl: './watch-tv.component.scss'
})
export class WatchTvComponent {
  protected readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  protected readonly domSanitizer = inject(DomSanitizer);
  protected readonly tvWatchProvider: WritableSignal<TvWatchProvider> = signal(new TvVidoraWatchProvider())
  protected readonly tvCurrentMediaInformation = toSignal(
    this.activatedRoute.paramMap.pipe(
      map((params: ParamMap) => {
        return {
          id: params.get('id') ?? '',
          season: Number(params.get('season')) || 1,
          episode: Number(params.get('episode')) || 1
        }
      }),
    ),
    {initialValue: {} as { id: string, season: number, episode: number }}
  );
  protected readonly tvMediaWatchLink = computed(() => {
    const mediaInformation = this.tvCurrentMediaInformation();
    return this.domSanitizer.bypassSecurityTrustResourceUrl(this.tvWatchProvider().provideLink(mediaInformation.id, mediaInformation.season, mediaInformation.episode));
  })
}
