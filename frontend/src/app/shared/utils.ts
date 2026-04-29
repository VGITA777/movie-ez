export function convertRuntimeToHoursAndMinutes(runtime: number): string {
  const hours: number = Math.floor(runtime / 60);
  const minutes: number = runtime % 60;
  return `${hours}h ${minutes.toFixed(0)}m`;
}

export function getYearFromDate(date?: string): string {
  if (!date) {
    return '';
  }

  return new Date(date).getFullYear().toString();
}
