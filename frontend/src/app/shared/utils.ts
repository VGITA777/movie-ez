import { GENRE_MAP } from '@shared/shared-types';

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
