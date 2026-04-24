package dev.prince.movieez.media.tmdb.requests;

import dev.prince.movieez.media.models.movies.MovieAlternativeTitlesModel;
import dev.prince.movieez.media.models.movies.MovieDetailsModel;
import dev.prince.movieez.media.models.movies.MovieKeywordsModel;
import dev.prince.movieez.media.models.movies.MovieLatestModel;
import dev.prince.movieez.media.models.movies.MovieRecommendationsModel;
import dev.prince.movieez.media.models.movies.MovieSimilarModel;
import dev.prince.movieez.media.models.shared.CreditsModel;
import dev.prince.movieez.media.models.shared.ImagesModel;
import dev.prince.movieez.media.models.shared.VideosModel;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(url = "/movie")
public interface MoviesRequests {

  @GetExchange("/{movieId}/alternative_titles")
  MovieAlternativeTitlesModel getMovieAlternativeTitles(
      @PathVariable
      long movieId,
      @RequestParam("country")
      String language
  );

  @GetExchange("/{movieId}/credits")
  CreditsModel getMovieCredits(
      @PathVariable
      long movieId,
      @RequestParam("language")
      String language
  );

  @GetExchange("/{movieId}")
  MovieDetailsModel getMovieDetails(
      @PathVariable
      long movieId,
      @RequestParam("language")
      String language
  );

  @GetExchange("/{movieId}/images")
  ImagesModel getMovieImages(
      @PathVariable
      long movieId,
      @RequestParam("language")
      String language
  );

  @GetExchange("/{movieId}/keywords")
  MovieKeywordsModel getMovieKeywords(
      @PathVariable
      long movieId
  );

  @GetExchange("/latest")
  MovieLatestModel getLatest();

  @GetExchange("/{movieId}/recommendations")
  MovieRecommendationsModel getMovieRecommendations(
      @PathVariable
      long movieId,
      @RequestParam("language")
      String language,
      @RequestParam("page")
      int page
  );

  @GetExchange("/{movieId}/similar")
  MovieSimilarModel getMovieSimilar(
      @PathVariable
      long movieId,
      @RequestParam("language")
      String language,
      @RequestParam("page")
      int page
  );

  @GetExchange("/{movieId}/videos")
  VideosModel getMovieVideos(
      @PathVariable
      long movieId,
      @RequestParam("language")
      String language
  );
}