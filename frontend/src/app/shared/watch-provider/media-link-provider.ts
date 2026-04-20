/*
 * Copyright (c) 2025. This code is created by Prince Angelo Coquia.
 */

import {MOVIE_EMBED_LINKS, TV_EMBED_LINKS, VideoSource} from '@constants';

export interface MediaLinkProvider {
  provideLink(id: number): string;

  provideLink(id: number, season: number, episode: number): string;
}

export abstract class MovieMediaLinkProvider implements MediaLinkProvider {

  constructor(private readonly baseLink: string) {
  }

  provideLink(id: number): string {
    return this.baseLink.replace('{id}', id.toString());
  }
}

export abstract class TvMediaLinkProvider implements MediaLinkProvider {

  constructor(private readonly baseLink: string) {
  }

  provideLink(id: number, season?: number, episode?: number): string {
    if (season === undefined || episode === undefined) {
      return this.baseLink.replace('{id}', id.toString());
    }
    return this.baseLink.replace('{id}', id.toString())
      .replace('{season}', season.toString())
      .replace('{episode}', episode.toString());
  }
}

export class FlixMovieMediaLinkProvider extends MovieMediaLinkProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.flix);
  }
}

export class VidoraMovieMediaLinkProvider extends MovieMediaLinkProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.vidora);
  }
}

export class EmbedsuMovieMediaLinkProvider extends MovieMediaLinkProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.embedsu);
  }
}

export class AutoembedMovieMediaLinkProvider extends MovieMediaLinkProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.autoembed);
  }
}

export class VidsrcMovieMediaLinkProvider extends MovieMediaLinkProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.vidsrc);
  }
}

export class VidlinkMovieMediaLinkProvider extends MovieMediaLinkProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.vidlink);
  }
}

export class VideasyMovieMediaLinkProvider extends MovieMediaLinkProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.videasy);
  }
}

export class OnemoviesMovieMediaLinkProvider extends MovieMediaLinkProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.onemovies);
  }
}

export class VidzeeMovieMediaLinkProvider extends MovieMediaLinkProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.vidzee);
  }
}

export class FlixTvMediaLinkProvider extends TvMediaLinkProvider {
  constructor() {
    super(TV_EMBED_LINKS.flix)
  }
}

export class VidoraTvMediaLinkProvider extends TvMediaLinkProvider {
  constructor() {
    super(TV_EMBED_LINKS.vidora)
  }
}

export class EmbedsuTvMediaLinkProvider extends TvMediaLinkProvider {
  constructor() {
    super(TV_EMBED_LINKS.embedsu)
  }
}

export class AutoembedTvMediaLinkProvider extends TvMediaLinkProvider {
  constructor() {
    super(TV_EMBED_LINKS.autoembed)
  }
}

export class VidsrcTvMediaLinkProvider extends TvMediaLinkProvider {
  constructor() {
    super(TV_EMBED_LINKS.vidsrc)
  }
}

export class VidlinkTvMediaLinkProvider extends TvMediaLinkProvider {
  constructor() {
    super(TV_EMBED_LINKS.vidlink)
  }
}

export class VideasyTvMediaLinkProvider extends TvMediaLinkProvider {
  constructor() {
    super(TV_EMBED_LINKS.videasy)
  }
}

export class OneMoviesTvMediaLinkProvider extends TvMediaLinkProvider {
  constructor() {
    super(TV_EMBED_LINKS.onemovies)
  }
}

export class VidzeeTvMediaLinkProvider extends TvMediaLinkProvider {
  constructor() {
    super(TV_EMBED_LINKS.vidzee)
  }
}

export const MOVIE_EMBED_OBJS: Record<VideoSource, MovieMediaLinkProvider> = {
  flix: new FlixMovieMediaLinkProvider(),
  vidora: new VidoraMovieMediaLinkProvider(),
  embedsu: new EmbedsuMovieMediaLinkProvider(),
  autoembed: new AutoembedMovieMediaLinkProvider(),
  vidsrc: new VidsrcMovieMediaLinkProvider(),
  vidlink: new VidlinkMovieMediaLinkProvider(),
  videasy: new VideasyMovieMediaLinkProvider(),
  onemovies: new OnemoviesMovieMediaLinkProvider(),
  vidzee: new VidzeeMovieMediaLinkProvider(),
};

export const TV_EMBED_OBJS: Record<VideoSource, TvMediaLinkProvider> = {
  flix: new FlixTvMediaLinkProvider(),
  vidora: new VidoraTvMediaLinkProvider(),
  embedsu: new EmbedsuTvMediaLinkProvider(),
  autoembed: new AutoembedTvMediaLinkProvider(),
  vidsrc: new VidsrcTvMediaLinkProvider(),
  vidlink: new VidlinkTvMediaLinkProvider(),
  videasy: new VideasyTvMediaLinkProvider(),
  onemovies: new OneMoviesTvMediaLinkProvider(),
  vidzee: new VidzeeTvMediaLinkProvider(),
};
