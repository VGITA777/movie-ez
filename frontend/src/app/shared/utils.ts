import { GENRE_MAP } from '@shared/shared-types';
import { Video, VideosModel } from '@shared/models';
import { forkJoin, Observable, of } from 'rxjs';

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
}): string {
  const { videoKey, muted, loop } = data;

  const params = new URLSearchParams({
    autoplay: '1',
    mute: muted ? '1' : '0',
    controls: '0',
    loop: loop ? '1' : '0',
    disablekb: '1',
  });

  if (loop) {
    params.set('playlist', videoKey);
  }

  return `https://www.youtube.com/embed/${videoKey}?${params.toString()}`;
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
