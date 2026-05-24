import { GENRE_MAP } from '@shared/shared-types';
import { Video, VideosModel } from '@shared/models';
import { forkJoin, Observable, of } from 'rxjs';
import { environment } from '@environments/environment';

export function convertRuntimeToHoursAndMinutes(runtime: number): string {
  const hours: number = Math.floor(runtime / 60);
  const minutes: number = runtime % 60;
  return `${hours}h ${minutes.toFixed(0)}m`;
}

export function getYearFromDate(date?: string): number | undefined {
  if (!date) {
    return undefined;
  }

  return new Date(date).getFullYear();
}

export function toGenres(genreIds: number[] | undefined): string[] {
  if (!genreIds) {
    return [];
  }

  return genreIds.map((genreId) => GENRE_MAP[genreId] ?? '').filter((genre) => genre !== '');
}

export function toTmdbImageUrl(
  path: string | null,
  size: string = 'original',
  placeholder: string = '/images/placeholder.png',
): string {
  if (!path) {
    return placeholder;
  }

  return `${environment.tmdb.imageBaseUrl ?? 'https://image.tmdb.org/t/p/'}${size}${path}`;
}

export async function loadFile<T>(filePath: string): Promise<T> {
  const response: Response = await fetch(filePath);

  if (!response.ok) {
    throw new Error(`Failed to load file: ${response.statusText}`);
  }

  return (await response.json()) as Promise<T>;
}

export function getYoutubeEmbedUrl(data: {
  videoKey: string;
  muted: boolean;
  loop: boolean;
  autoplay?: boolean;
  controls?: boolean;
}): string {
  const { videoKey, muted, loop, autoplay, controls = true } = data;

  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    mute: muted ? '1' : '0',
    controls: controls ? '1' : '0',
    // Allow fullscreen button in the YouTube player UI.
    fs: '1',
    // Useful for mobile/browser behavior.
    playsinline: '1',
    loop: loop ? '1' : '0',
    disablekb: controls ? '0' : '1',
    rel: '0',
  });

  if (loop) {
    params.set('playlist', videoKey);
  }

  return `https://www.youtube.com/embed/${encodeURIComponent(videoKey)}?${params.toString()}`;
}
export function pickYoutubeTrailer(videos: VideosModel): Video | undefined {
  const candidates = videos.results.filter(
    (video) => video.site === 'YouTube' && video.type === 'Trailer',
  );
  return candidates.find((video) => video.official) ?? candidates[0];
}

export function pickYoutubeTrailerFromArray(videos: Video[]): Video | undefined {
  const candidates = videos.filter((video) => video.site === 'YouTube' && video.type === 'Trailer');
  return candidates.find((video) => video.official) ?? candidates[0];
}

export function normalizeGenres(genres?: string[], separator: string = '&'): string[] {
  if (!genres) {
    return [];
  }

  return [
    ...new Set(
      genres.flatMap((genre) => {
        return genre
          .split(separator)
          .map((g) => g.trim())
          .filter((g) => g !== '' && g.length > 0);
      }),
    ),
  ];
}

export function forkJoinOrEmpty<T>(observables: Observable<T>[]): Observable<T[]> {
  if (observables.length === 0) {
    return of([]);
  } else {
    return forkJoin(observables);
  }
}

export function getUpdateLabel(timestamp: string): string {
  if (!timestamp || timestamp.trim().length === 0) {
    return 'Unknown';
  }

  const parsedTime = Date.parse(timestamp.trim());

  // Fallback in case the timestamp is invalid or missing
  if (isNaN(parsedTime)) {
    return 'Unknown';
  }

  const editDate = new Date(parsedTime);
  const today = new Date();

  editDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffInMs = today.getTime() - editDate.getTime();
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return 'Today';
  }

  if (diffInDays === 1) {
    return 'Yesterday';
  }

  if (diffInDays > 1 && diffInDays <= 5) {
    return `${diffInDays} Days Ago`;
  }

  return 'Long time ago';
}
