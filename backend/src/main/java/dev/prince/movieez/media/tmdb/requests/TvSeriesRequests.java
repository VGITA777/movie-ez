package dev.prince.movieez.media.tmdb.requests;

import dev.prince.movieez.media.models.shared.CreditsModel;
import dev.prince.movieez.media.models.shared.ImagesModel;
import dev.prince.movieez.media.models.shared.VideosModel;
import dev.prince.movieez.media.models.tvseries.TvSeriesDetailsModel;
import dev.prince.movieez.media.models.tvseries.TvSeriesKeywordsModel;
import dev.prince.movieez.media.models.tvseries.TvSeriesLatestModel;
import dev.prince.movieez.media.models.tvseries.TvSeriesRecommendationsModel;
import dev.prince.movieez.media.models.tvseries.TvSeriesSimilarModel;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(url = "/tv")
public interface TvSeriesRequests {

  @GetExchange("/{seriesId}/credits")
  CreditsModel getTvSeriesCredits(
      @PathVariable
      long seriesId,
      @RequestParam("language")
      String language
  );

  @GetExchange("/{seriesId}")
  TvSeriesDetailsModel getTvSeriesDetails(
      @PathVariable
      long seriesId,
      @RequestParam("language")
      String language
  );

  @GetExchange("/{seriesId}/images")
  ImagesModel getTvSeriesImages(
      @PathVariable
      long seriesId,
      @RequestParam("language")
      String language
  );

  @GetExchange("/{seriesId}/keywords")
  TvSeriesKeywordsModel getTvSeriesKeywords(
      @PathVariable
      long seriesId
  );

  @GetExchange("/latest")
  TvSeriesLatestModel getLatestTvSeries();

  @GetExchange("/{seriesId}/recommendations")
  TvSeriesRecommendationsModel getTvSeriesRecommendations(
      @PathVariable
      long seriesId,
      @RequestParam("language")
      String language,
      @RequestParam("page")
      int page
  );

  @GetExchange("/{seriesId}/similar")
  TvSeriesSimilarModel getTvSeriesSimilar(
      @PathVariable
      long seriesId,
      @RequestParam("language")
      String language,
      @RequestParam("page")
      int page
  );

  @GetExchange("/{seriesId}/videos")
  VideosModel getTvSeriesVideos(
      @PathVariable
      long seriesId,
      @RequestParam("language")
      String language
  );
}
