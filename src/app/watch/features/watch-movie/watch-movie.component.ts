import {Component, computed, inject, Signal, signal, WritableSignal} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {MovieVidoraWatchProvider, MovieWatchProvider} from '../../../shared/watch-provider/watch-prover';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';

@Component({
  selector: 'app-watch-movie',
  imports: [],
  templateUrl: './watch-movie.component.html',
  styleUrl: './watch-movie.component.scss'
})
export class WatchMovieComponent {
  protected readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  protected readonly domSanitizer: DomSanitizer = inject(DomSanitizer);
  protected readonly movieWatchProvider: WritableSignal<MovieWatchProvider> = signal(new MovieVidoraWatchProvider())
  protected readonly movieCurrentMediaInformation: Signal<{ id: string }> = toSignal(
    this.activatedRoute.paramMap.pipe(
      map((params: ParamMap) => {
        return {
          id: params.get('id') ?? '',
        }
      }),
    ),
    {initialValue: {} as { id: string }}
  );
  protected readonly movieMediaWatchLink: Signal<SafeResourceUrl> = computed(() => {
    const mediaInformation = this.movieCurrentMediaInformation();
    return this.domSanitizer.bypassSecurityTrustResourceUrl(this.movieWatchProvider().provideLink(mediaInformation.id));
  })
}
