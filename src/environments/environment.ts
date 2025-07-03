export const environment = {
  isLoggingEnabled: false,
  apiKey: '',
  imageBaseUrl: "https://image.tmdb.org/t/p/",
  fullImageUrl: (path: string, size: string) => `https://image.tmdb.org/t/p/${size}${path}`,
  language: "en",
  defaultImageSize: "w500",
  defaultWatchImageSize: "original",
};
