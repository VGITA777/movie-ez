import {MOVIE_EMBED_LINKS, TV_EMBED_LINKS} from '../constants';

export interface WatchProver {
  provideLink(id: string): string;

  provideLink(id: string, season: number, episode: number): string;
}

export abstract class MovieWatchProvider implements WatchProver {

  constructor(private readonly baseLink: string) {
  }

  provideLink(id: string): string {
    return this.baseLink.replace('{id}', id);
  }
}

export abstract class TvWatchProvider implements WatchProver {

  constructor(private readonly baseLink: string) {
  }

  provideLink(id: string, season?: number, episode?: number): string {
    if (season === undefined || episode === undefined) {
      return this.baseLink.replace('{id}', id);
    }
    return this.baseLink.replace('{id}', id)
      .replace('{season}', season.toString())
      .replace('{episode}', episode.toString());
  }
}

export class MovieFlixWatchProvider extends MovieWatchProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.flix);
  }
}

export class MovieVidoraWatchProvider extends MovieWatchProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.vidora);
  }
}

export class MovieEmbedsuWatchProvider extends MovieWatchProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.embedsu);
  }
}

export class MovieAutoembedWatchProvider extends MovieWatchProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.autoembed);
  }
}

export class MovieVidsrcWatchProvider extends MovieWatchProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.vidsrc);
  }
}

export class MovieVidlinkWatchProvider extends MovieWatchProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.vidlink);
  }
}

export class MovieVideasyWatchProvider extends MovieWatchProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.videasy);
  }
}

export class MovieOnemoviesWatchProvider extends MovieWatchProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.onemovies);
  }
}

export class MovieVidzeeWatchProvider extends MovieWatchProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.vidzee);
  }
}

export class TvFlixWatchProvider extends TvWatchProvider {
  constructor() {
    super(TV_EMBED_LINKS.flix)
  }
}

export class TvVidoraWatchProvider extends TvWatchProvider {
  constructor() {
    super(TV_EMBED_LINKS.vidora)
  }
}

export class TvEmbedsuWatchProvider extends TvWatchProvider {
  constructor() {
    super(TV_EMBED_LINKS.embedsu)
  }
}

export class TvAutoembedWatchProvider extends TvWatchProvider {
  constructor() {
    super(TV_EMBED_LINKS.autoembed)
  }
}

export class TvVidsrcWatchProvider extends TvWatchProvider {
  constructor() {
    super(TV_EMBED_LINKS.vidsrc)
  }
}

export class TvVidlinkWatchProvider extends TvWatchProvider {
  constructor() {
    super(TV_EMBED_LINKS.vidlink)
  }
}

export class TvVideasyWatchProvider extends TvWatchProvider {
  constructor() {
    super(TV_EMBED_LINKS.videasy)
  }
}

export class TvOnemoviesWatchProvider extends TvWatchProvider {
  constructor() {
    super(TV_EMBED_LINKS.onemovies)
  }
}

export class TvVidzeeWatchProvider extends TvWatchProvider {
  constructor() {
    super(TV_EMBED_LINKS.vidzee)
  }
}
