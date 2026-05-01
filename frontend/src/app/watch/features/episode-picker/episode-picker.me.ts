import {
  Component,
  computed,
  effect,
  EffectRef,
  inject,
  input,
  InputSignal,
  OnDestroy,
  output,
  OutputEmitterRef,
  ResourceRef,
  Signal,
} from '@angular/core';
import { TvSeasonDetailsEpisode, TvSeasonDetailsModel, TvSeriesDetailsModel } from '@shared/models';
import { TvSeasonData } from '@shared/tv-season-data';
import { MediaTvSeriesSeasonService } from '@shared/services/media-tv-series-season.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { EpisodeCardMe } from '@watch/features/episode-picker/episode-card/episode-card.me';
import { environment } from '@environments/environment';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { watchPageQueryParams } from '@watch/watch.me';
import { queryParams } from '@signality/core';
import { NavigationFacade } from '@shared/services/navigation-facade.service';
import { FormsModule } from '@angular/forms';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'me-episode-picker',
  imports: [
    EpisodeCardMe,
    HlmScrollAreaImports,
    HlmScrollAreaImports,
    NgScrollbarModule,
    FormsModule,
    HlmSelectImports,
    HlmSkeletonImports,
    NgTemplateOutlet,
  ],
  templateUrl: './episode-picker.me.html',
  styleUrl: './episode-picker.me.css',
})
export class EpisodePickerMe implements OnDestroy {
  private readonly tvSeriesSeasonService: MediaTvSeriesSeasonService = inject(
    MediaTvSeriesSeasonService,
  );
  private readonly navigator: NavigationFacade = inject(NavigationFacade);
  private readonly errorWatcher: EffectRef;
  private readonly queryParams = queryParams({ schema: watchPageQueryParams });
  private readonly itemData: Signal<TvSeasonData> = computed(() => {
    return new TvSeasonData(this.item().id, this.selectedSeason(), this.tvSeriesSeasonService);
  });
  private readonly seasonDetails: ResourceRef<TvSeasonDetailsModel | undefined> = rxResource({
    params: (): TvSeasonData => this.itemData(),
    stream: (data): Observable<TvSeasonDetailsModel> => {
      return data.params.getDetails();
    },
  });

  protected readonly environment = environment;
  protected readonly selectedSeason: Signal<number> = computed(() => {
    return this.queryParams.value().season ?? 1;
  });
  protected readonly episodes: Signal<TvSeasonDetailsEpisode[]> = computed(() => {
    return (
      this.seasonDetails.value()?.episodes?.filter((ep) => {
        return new Date(ep.air_date) <= new Date();
      }) ?? []
    );
  });
  protected readonly isLoading: Signal<boolean> = this.seasonDetails.isLoading;

  public readonly item: InputSignal<TvSeriesDetailsModel & { id: number }> = input.required();
  public readonly onEpisodeClicked: OutputEmitterRef<TvSeasonDetailsEpisode> = output();

  constructor() {
    this.errorWatcher = effect(() => {
      if (this.seasonDetails.error()) {
        this.navigator.navigateToHomePage({
          messages: [
            {
              type: 'error',
              message: 'Failed to load season details. Please try again later.',
            },
          ],
        });
      }
    });
  }

  public ngOnDestroy(): void {
    this.errorWatcher.destroy();
  }

  protected handleSeasonChange(season: number | null): void {
    if (season === null) {
      return;
    }

    const queryParams = this.queryParams.value();
    this.navigator.navigateToWatchPage({
      mediaType: queryParams.type,
      mediaId: queryParams.id,
      season,
      episode: 1,
      extras: {
        replaceUrl: true,
      },
    });
  }
}
