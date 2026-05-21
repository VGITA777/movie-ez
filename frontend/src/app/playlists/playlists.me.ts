import { Component, computed, inject, linkedSignal, Signal, WritableSignal } from '@angular/core';
import { UserLocalPlaylistService } from '@shared/services/user/user-local-playlist.service';
import {
  OfflinePlaylist,
  SortingDirection,
  SortingOptionEntry,
  StoredSortingOption,
} from '@shared/models';
import { PlaylistsEntryMe } from '@playlists/features/playlists-entry/playlists-entry.me';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArrowDownWideNarrow,
  lucideArrowUpDown,
  lucideArrowUpNarrowWide,
  lucideCirclePlus,
  lucideCloudSync,
  lucideRefreshCw,
} from '@ng-icons/lucide';
import { NgTemplateOutlet } from '@angular/common';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { AuthFacadeService } from '@shared/services/auth-facade-service';
import { UserPlaylistManagerService } from '@shared/services/user/user-playlist-manager.service';
import { breakpoints, storage } from '@signality/core';
import { DEFAULT_BREAKPOINTS } from '@shared/shared-types';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { PLAYLIST_SORT_OPTION_STORAGE_KEY } from '@shared/constants';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';

type SortingOption = 'name' | 'creation' | 'modification' | 'tracksCount';

const SORTING_OPTIONS: SortingOptionEntry<SortingOption>[] = [
  { label: 'Name', value: 'name' },
  { label: 'Creation Date', value: 'creation' },
  { label: 'Last Update', value: 'modification' },
  { label: 'Tracks Count', value: 'tracksCount' },
];

const SORTING_OPTIONS_MAP: Record<
  SortingOption,
  SortingOptionEntry<SortingOption>
> = Object.fromEntries(SORTING_OPTIONS.map((option) => [option.value, option])) as Record<
  SortingOption,
  SortingOptionEntry<SortingOption>
>;

const DEFAULT_STORED_SORTING_OPTION: StoredSortingOption<SortingOption> = {
  sortingOption: 'name',
  direction: 'asc',
};

@Component({
  selector: 'me-playlists',
  imports: [
    PlaylistsEntryMe,
    HlmSeparatorImports,
    HlmIconImports,
    NgTemplateOutlet,
    HlmButtonImports,
    HlmSkeletonImports,
    HlmDropdownMenuImports,
    HlmButtonGroupImports,
  ],
  templateUrl: './playlists.me.html',
  styleUrl: './playlists.me.css',
  providers: [
    provideIcons({
      lucideCirclePlus,
      lucideRefreshCw,
      lucideCloudSync,
      lucideArrowUpDown,
      lucideArrowDownWideNarrow,
      lucideArrowUpNarrowWide,
    }),
  ],
})
export class PlaylistsMe {
  private readonly userLocalPlaylistService: UserLocalPlaylistService =
    inject(UserLocalPlaylistService);

  private readonly authFacade: AuthFacadeService = inject(AuthFacadeService);
  private readonly userPlaylistManagerService: UserPlaylistManagerService = inject(
    UserPlaylistManagerService,
  );
  private readonly storedSortingOption: WritableSignal<StoredSortingOption<SortingOption>> =
    storage(PLAYLIST_SORT_OPTION_STORAGE_KEY, DEFAULT_STORED_SORTING_OPTION);

  protected readonly bp = breakpoints(DEFAULT_BREAKPOINTS);
  protected readonly sortingOptions: SortingOptionEntry<SortingOption>[] = SORTING_OPTIONS;
  protected readonly selectedSortingOption: WritableSignal<SortingOptionEntry<SortingOption>> =
    linkedSignal(() => {
      const storedValue: SortingOption =
        this.storedSortingOption().sortingOption ?? DEFAULT_STORED_SORTING_OPTION.sortingOption;

      return SORTING_OPTIONS_MAP[storedValue] ?? SORTING_OPTIONS_MAP.name;
    });
  protected readonly selectedSortingDirection: WritableSignal<SortingDirection> = linkedSignal(
    () => {
      return this.storedSortingOption().direction ?? DEFAULT_STORED_SORTING_OPTION.direction;
    },
  );
  protected readonly playlists: Signal<OfflinePlaylist[]> = this.userLocalPlaylistService.playlists;
  protected readonly sortedPlaylists: Signal<OfflinePlaylist[]> = computed(() => {
    const playlists: OfflinePlaylist[] = this.playlists();
    const sortingOption: SortingOption = this.selectedSortingOption().value;
    const direction: SortingDirection = this.selectedSortingDirection();

    return [...playlists].sort((a, b) => {
      const result = this.comparePlaylists(a, b, sortingOption);
      return direction === 'asc' ? result : -result;
    });
  });
  protected readonly isAuthenticated = this.authFacade.isAuthenticated;
  protected readonly isSyncing = this.userPlaylistManagerService.isSyncing;
  protected readonly playlistEntrySkeletonCount: number[] = Array(6).fill(0);

  protected createNewPlaylist(): void {
    this.userLocalPlaylistService.createBlankPlaylist().subscribe();
  }

  protected syncPlaylists(): void {
    this.userPlaylistManagerService.sync();
  }

  protected toggleSortingDirection(): void {
    const nextDirection: SortingDirection =
      this.selectedSortingDirection() === 'asc' ? 'desc' : 'asc';
    console.log(`Toggling sorting direction to: ${nextDirection}`);
    this.selectedSortingDirection.set(nextDirection);
    this.updateSortingDirection(nextDirection);
  }

  protected updatedSelectedSortingOption(data: SortingOptionEntry<SortingOption>): void {
    this.selectedSortingOption.set(data);

    this.storedSortingOption.set({
      sortingOption: data.value,
      direction: this.selectedSortingDirection(),
    });
  }

  private updateSortingDirection(direction: SortingDirection): void {
    this.selectedSortingDirection.set(direction);

    this.storedSortingOption.update((current) => {
      return {
        sortingOption: current.sortingOption ?? DEFAULT_STORED_SORTING_OPTION.sortingOption,
        direction,
      };
    });
  }

  private comparePlaylists(
    first: OfflinePlaylist,
    second: OfflinePlaylist,
    sortingOption: SortingOption,
  ): number {
    switch (sortingOption) {
      case 'name':
        return first.name.localeCompare(second.name);

      case 'creation':
        return this.compareInstantsAsc(first.createdOn, second.createdOn);

      case 'modification':
        return this.compareInstantsAsc(first.lastEditTimestamp, second.lastEditTimestamp);

      case 'tracksCount':
        return first.items.length - second.items.length;

      default:
        return 0;
    }
  }

  private compareInstantsAsc(
    left: string | null | undefined,
    right: string | null | undefined,
  ): number {
    return this.toInstantEpochMs(left) - this.toInstantEpochMs(right);
  }

  private toInstantEpochMs(value: string | null | undefined): number {
    if (!value) {
      return 0;
    }

    const parsed = Date.parse(value);

    return Number.isNaN(parsed) ? 0 : parsed;
  }
}
