import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {take} from 'rxjs';
import {OnTheAir, PopularTvShows, TopRatedTvShows, TvShowsAiringToday} from 'tmdb-ts';
import {ProgressShowerService} from '../shared/utils/progress-shower.service';
import {MediaSliderComponent} from '../shared/ui/media-slider/media-slider.component';
import {ScrollTopComponent} from '../shared/ui/scroll-top/scroll-top.component';
import {WatchNavigationHandler} from '../shared/utils/navigator.service';

@Component({
  selector: 'app-tv-shows',
  imports: [
    MediaSliderComponent,
    ScrollTopComponent
  ],
  templateUrl: './tv-shows.component.html',
  styleUrl: './tv-shows.component.scss'
})
export class TvShowsComponent extends WatchNavigationHandler implements OnInit {

  public readonly airingTodayTvSeries: WritableSignal<TvShowsAiringToday> = signal({} as TvShowsAiringToday);
  public readonly onTheAirTvSeries: WritableSignal<OnTheAir> = signal({} as OnTheAir);
  public readonly topRatedTvSeries: WritableSignal<TopRatedTvShows> = signal({} as TopRatedTvShows);
  public readonly popularTvShows: WritableSignal<PopularTvShows> = signal({} as PopularTvShows);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly progressShower: ProgressShowerService = inject(ProgressShowerService);

  ngOnInit(): void {
    this.activatedRoute.data.pipe(take(1)).subscribe((data) => {
      this.airingTodayTvSeries.set(data['airingTodayTvSeries']);
      this.onTheAirTvSeries.set(data['onTheAirTvSeries']);
      this.topRatedTvSeries.set(data['topRatedTvSeries']);
      this.popularTvShows.set(data['popularTvShows']);
      this.progressShower.hide();
    });
  }
}
