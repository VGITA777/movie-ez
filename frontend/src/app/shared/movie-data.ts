import {
  CountryCode,
  CreditsModel,
  ImagesModel,
  LanguageCode,
  MovieAlternativeTitlesModel,
  MovieDetailsModel,
  MovieKeywordsModel,
  MovieRecommendationsModel,
  MovieSimilarModel,
  VideosModel,
} from '@shared/models';
import { MediaMovieService } from './services/media/media-movie.service';
import { Observable } from 'rxjs';

export class MovieData {
  private readonly id: number;
  private readonly movieService: MediaMovieService;

  constructor(id: number, movieService: MediaMovieService) {
    this.id = id;
    this.movieService = movieService;
  }

  public getId(): number {
    return this.id;
  }

  public getAlternativeTitles(countryCode?: CountryCode): Observable<MovieAlternativeTitlesModel> {
    return this.movieService.getMovieAlternativeTitles(this.id, countryCode);
  }

  public getCredits(language?: LanguageCode): Observable<CreditsModel> {
    return this.movieService.getMovieCredits(this.id, language);
  }

  public getDetails(language?: LanguageCode): Observable<MovieDetailsModel> {
    return this.movieService.getMovieDetails(this.id, language);
  }

  public getImages(language?: LanguageCode): Observable<ImagesModel> {
    return this.movieService.getMovieImages(this.id, language);
  }

  public getKeywords(): Observable<MovieKeywordsModel> {
    return this.movieService.getMovieKeywords(this.id);
  }

  public getRecommendations(
    language?: LanguageCode,
    page?: number,
  ): Observable<MovieRecommendationsModel> {
    return this.movieService.getMovieRecommendations(this.id, language, page);
  }

  public getSimilar(language?: LanguageCode, page?: number): Observable<MovieSimilarModel> {
    return this.movieService.getMovieSimilar(this.id, language, page);
  }

  public getVideos(language?: LanguageCode): Observable<VideosModel> {
    return this.movieService.getMovieVideos(this.id, language);
  }
}
