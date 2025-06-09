export const ONE_DAY_MILLIS = 1000 * 60 * 60 * 24;

/* Movies Cache */
export const MOVIES_CACHE_NAMESPACE = 'movies-cache';

export const DISCOVER_MOVIES_NAMESPACE = 'discover-movies';
export const DISCOVER_MOVIES_CACHE_KEY = 'discover-movies';

export const UPCOMING_MOVIES_NAMESPACE = 'upcoming-movies';
export const UPCOMING_MOVIES_CACHE_KEY = 'upcoming-movies';

export const POPULAR_MOVIES_NAMESPACE = 'popular-movies';
export const POPULAR_MOVIES_CACHE_KEY = 'popular-movies';

export const TOP_RATED_MOVIES_NAMESPACE = 'top-rated-movies';
export const TOP_RATED_MOVIES_CACHE_KEY = 'top-rated-movies';

export const NOW_PLAYING_MOVIES_NAMESPACE = 'now-playing-movies';
export const NOW_PLAYING_MOVIES_CACHE_KEY = 'now-playing-movies';

/* TV shows Cache Keys */
export const DISCOVER_TV_SHOWS_NAMESPACE = 'discover-tv-shows';
export const DISCOVER_TV_SHOWS_CACHE_KEY = 'discover-tv-shows';

export const POPULAR_TV_SHOWS_NAMESPACE = 'popular-tv-shows';
export const POPULAR_TV_SHOWS_CACHE_KEY = 'popular-tv-shows';

export const AIRING_TODAY_TV_SHOWS_NAMESPACE = 'airing-today-tv-series';
export const AIRING_TODAY_TV_SHOWS_CACHE_KEY = 'airing-today-tv-series';


export const ON_THE_AIR_TV_SHOWS_NAMESPACE = 'on-the-air-tv-series';
export const ON_THE_AIR_TV_SHOWS_CACHE_KEY = 'on-the-air-tv-series';

export const TOP_RATED_TV_SHOWS_NAMESPACE = 'top-rated-tv-series';
export const TOP_RATED_TV_SHOWS_CACHE_KEY = 'top-rated-tv-series';

/* Watch providers */

export type VideoSource =
  "flix"
  | "vidora"
  | "embedsu"
  | "autoembed"
  | "vidsrc"
  | "vidlink"
  | "videasy"
  | "onemovies"
  | "vidzee"

export const MOVIE_EMBED_LINKS: Record<VideoSource, string> = {
  flix: 'https://flix.1ani.me/embed/tmdb-movie-{id}',
  vidora: 'https://vidora.su/movie/{id}?colour=663399&autoplay=false&autonextepisode=false&pausescreen=true',
  embedsu: 'https://embed.su/embed/movie/{id}',
  autoembed: 'https://player.autoembed.cc/embed/movie/{id}',
  vidsrc: 'https://vidsrc.in/embed/movie/{id}',
  vidlink: 'https://vidlink.pro/movie/{id}',
  videasy: 'https://player.videasy.net/movie/{id}',
  onemovies: 'https://111movies.com/movie/{id}',
  vidzee: 'https://player.vidzee.wtf/embed/movie/{id}',
};

export const TV_EMBED_LINKS: Record<VideoSource, string> = {
  flix: 'https://flix.1ani.me/embed/tmdb-tv-{id}/{season}/{episode}',
  vidora: 'https://vidora.su/tv/{id}/{season}/{episode}?colour=663399&autoplay=false&autonextepisode=false&pausescreen=true',
  embedsu: 'https://embed.su/embed/tv/{id}/{season_number}/{episode_number}',
  autoembed: 'https://player.autoembed.cc/embed/tv/{id}/{season}/{episode}',
  vidsrc: 'https://vidsrc.xyz/embed/tv/{id}/{season}/{episode}',
  vidlink: 'https://vidlink.pro/tv/{id}/{season}/{episode}',
  videasy: 'https://player.videasy.net/tv/{id}/{season}/{episode}',
  onemovies: 'https://111movies.com/tv/{id}/{season}/{episode}',
  vidzee: 'https://player.vidzee.wtf/embed/tv/{id}/{season}/{episode}',
}
