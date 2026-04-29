export function convertRuntimeToHoursAndMinutes(runtime: number): string {
  const hours: number = Math.floor(runtime / 60);
  const minutes: number = runtime % 60;
  return `${hours}h ${minutes.toFixed(0)}m`;
}
