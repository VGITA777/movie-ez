export const environment = {
  isLoggingEnabled: false,
  apiKey: '',
  imageBaseUrl: "https://image.tmdb.org/t/p/",
  defaultImageSize: "w500",
  fullImageUrl: (path: string, size: string) => `https://image.tmdb.org/t/p/${size}${path}`,
  language: "en-US"
};
