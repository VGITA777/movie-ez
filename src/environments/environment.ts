export const environment = {
  isLoggingEnabled: false,
  apiKey: '',
  imageBaseUrl: "https://image.tmdb.org/t/p/",
  defaultImageSize: "w500",
  defaultWatchImageSize: "original",
  fullImageUrl: (path: string, size: string) => `https://image.tmdb.org/t/p/${size}${path}`,
  language: "en-US"
};
