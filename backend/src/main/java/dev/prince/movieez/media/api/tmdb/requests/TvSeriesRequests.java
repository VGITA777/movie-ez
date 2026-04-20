package dev.prince.movieez.media.api.tmdb.requests;

import dev.prince.movieez.media.api.models.shared.CreditsModel;
import dev.prince.movieez.media.api.models.shared.ImagesModel;
import dev.prince.movieez.media.api.models.shared.VideosModel;
import dev.prince.movieez.media.api.models.tvseries.TvSeriesDetailsModel;
import dev.prince.movieez.media.api.models.tvseries.TvSeriesKeywordsModel;
import dev.prince.movieez.media.api.models.tvseries.TvSeriesLatestModel;
import dev.prince.movieez.media.api.models.tvseries.TvSeriesRecommendationsModel;
import dev.prince.movieez.media.api.models.tvseries.TvSeriesSimilarModel;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(url = "https://api.themoviedb.org/3/tv")
public interface TvSeriesRequests {

  @GetExchange("/{seriesId}/credits")
  CreditsModel getTvSeriesCredits(
      @PathVariable("seriesId")
      long seriesId,
      @RequestParam("language")
      String language
  );

  @GetExchange("/{seriesId}")
  TvSeriesDetailsModel getTvSeriesDetails(
      @PathVariable("seriesId")
      long seriesId,
      @RequestParam("language")
      String language
  );

  @GetExchange("/{seriesId}/images")
  ImagesModel getTvSeriesImages(
      @PathVariable("seriesId")
      long seriesId,
      @RequestParam("language")
      String language
  );

  @GetExchange("/{seriesId}/keywords")
  TvSeriesKeywordsModel getTvSeriesKeywords(
      @PathVariable("seriesId")
      long seriesId
  );

  @GetExchange("/latest")
  TvSeriesLatestModel getLatestTvSeries();

  @GetExchange("/{seriesId}/recommendations")
  TvSeriesRecommendationsModel getTvSeriesRecommendations(
      @PathVariable("seriesId")
      long seriesId,
      @RequestParam("language")
      String language,
      @RequestParam("page")
      int page
  );

  @GetExchange("/{seriesId}/similar")
  TvSeriesSimilarModel getTvSeriesSimilar(
      @PathVariable("seriesId")
      long seriesId,
      @RequestParam("language")
      String language,
      @RequestParam("page")
      int page
  );

  @GetExchange("/{seriesId}/videos")
  VideosModel getTvSeriesVideos(
      @PathVariable("seriesId")
      long seriesId,
      @RequestParam("language")
      String language
  );
}
