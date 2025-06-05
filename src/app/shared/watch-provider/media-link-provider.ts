import {MOVIE_EMBED_LINKS, TV_EMBED_LINKS} from '../constants';

export interface MediaLinkProvider {
  provideLink(id: string): string;

  provideLink(id: string, season: number, episode: number): string;
}

export abstract class MovieMediaLinkProvider implements MediaLinkProvider {

  constructor(private readonly baseLink: string) {
  }

  provideLink(id: string): string {
    return this.baseLink.replace('{id}', id);
  }
}

export abstract class TvMediaLinkProvider implements MediaLinkProvider {

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

export class FlixProviderTypeProviderMediaLinkProvider extends MovieMediaLinkProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.flix);
  }
}

export class VidoraProviderTypeProviderMediaLinkProvider extends MovieMediaLinkProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.vidora);
  }
}

export class EmbedsuProviderTypeProviderMediaLinkProvider extends MovieMediaLinkProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.embedsu);
  }
}

export class AutoembedProviderTypeProviderMediaLinkProvider extends MovieMediaLinkProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.autoembed);
  }
}

export class VidsrcProviderTypeProviderMediaLinkProvider extends MovieMediaLinkProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.vidsrc);
  }
}

export class VidlinkProviderTypeProviderMediaLinkProvider extends MovieMediaLinkProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.vidlink);
  }
}

export class VideasyProviderTypeProviderMediaLinkProvider extends MovieMediaLinkProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.videasy);
  }
}

export class OnemoviesProviderTypeProviderMediaLinkProvider extends MovieMediaLinkProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.onemovies);
  }
}

export class VidzeeProviderTypeProviderMediaLinkProvider extends MovieMediaLinkProvider {
  constructor() {
    super(MOVIE_EMBED_LINKS.vidzee);
  }
}

export class TvFlixProviderTypeProviderMediaLinkProvider extends TvMediaLinkProvider {
  constructor() {
    super(TV_EMBED_LINKS.flix)
  }
}

export class TvVidoraProviderTypeProviderMediaLinkProvider extends TvMediaLinkProvider {
  constructor() {
    super(TV_EMBED_LINKS.vidora)
  }
}

export class TvEmbedsuProviderTypeProviderMediaLinkProvider extends TvMediaLinkProvider {
  constructor() {
    super(TV_EMBED_LINKS.embedsu)
  }
}

export class TvAutoembedProviderTypeProviderMediaLinkProvider extends TvMediaLinkProvider {
  constructor() {
    super(TV_EMBED_LINKS.autoembed)
  }
}

export class TvVidsrcProviderTypeProviderMediaLinkProvider extends TvMediaLinkProvider {
  constructor() {
    super(TV_EMBED_LINKS.vidsrc)
  }
}

export class TvVidlinkProviderTypeProviderMediaLinkProvider extends TvMediaLinkProvider {
  constructor() {
    super(TV_EMBED_LINKS.vidlink)
  }
}

export class TvVideasyProviderTypeProviderMediaLinkProvider extends TvMediaLinkProvider {
  constructor() {
    super(TV_EMBED_LINKS.videasy)
  }
}

export class TvOnemoviesProviderTypeProviderMediaLinkProvider extends TvMediaLinkProvider {
  constructor() {
    super(TV_EMBED_LINKS.onemovies)
  }
}

export class TvVidzeeProviderTypeProviderMediaLinkProvider extends TvMediaLinkProvider {
  constructor() {
    super(TV_EMBED_LINKS.vidzee)
  }
}
