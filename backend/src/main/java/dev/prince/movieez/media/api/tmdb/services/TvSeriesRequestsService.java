package dev.prince.movieez.media.api.tmdb.services;

import dev.prince.movieez.media.api.models.shared.CreditsModel;
import dev.prince.movieez.media.api.models.shared.ImagesModel;
import dev.prince.movieez.media.api.models.shared.VideosModel;
import dev.prince.movieez.media.api.models.tvseries.TvSeriesDetailsModel;
import dev.prince.movieez.media.api.models.tvseries.TvSeriesKeywordsModel;
import dev.prince.movieez.media.api.models.tvseries.TvSeriesLatestModel;
import dev.prince.movieez.media.api.models.tvseries.TvSeriesRecommendationsModel;
import dev.prince.movieez.media.api.models.tvseries.TvSeriesSimilarModel;
import dev.prince.movieez.media.api.tmdb.requests.TvSeriesRequests;
import dev.prince.movieez.media.caching.utils.TvSeriesCacheConfigurer;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Service
public class TvSeriesRequestsService {

  private final TvSeriesRequests tvSeriesRequests;

  public TvSeriesRequestsService(HttpServiceProxyFactory httpServiceProxyFactory) {
    this.tvSeriesRequests = httpServiceProxyFactory.createClient(TvSeriesRequests.class);
  }


  @Cacheable(cacheNames = TvSeriesCacheConfigurer.TV_SERIES_CREDITS)
  public CreditsModel getTvSeriesCredits(long seriesId, String language) {
    return tvSeriesRequests.getTvSeriesCredits(seriesId, language);
  }

  @Cacheable(cacheNames = TvSeriesCacheConfigurer.TV_SERIES_DETAILS)
  public TvSeriesDetailsModel getTvSeriesDetails(long seriesId, String language) {
    return tvSeriesRequests.getTvSeriesDetails(seriesId, language);
  }

  @Cacheable(cacheNames = TvSeriesCacheConfigurer.TV_SERIES_IMAGES)
  public ImagesModel getTvSeriesImages(long seriesId, String language) {
    return tvSeriesRequests.getTvSeriesImages(seriesId, language);
  }

  @Cacheable(cacheNames = TvSeriesCacheConfigurer.TV_SERIES_KEYWORDS)
  public TvSeriesKeywordsModel getTvSeriesKeywords(long seriesId) {
    return tvSeriesRequests.getTvSeriesKeywords(seriesId);
  }

  @Cacheable(cacheNames = TvSeriesCacheConfigurer.TV_SERIES_LATEST)
  public TvSeriesLatestModel getLatestTvSeries() {
    return tvSeriesRequests.getLatestTvSeries();
  }

  @Cacheable(cacheNames = TvSeriesCacheConfigurer.TV_SERIES_RECOMMENDATIONS)
  public TvSeriesRecommendationsModel getTvSeriesRecommendations(long seriesId, String language, int page) {
    return tvSeriesRequests.getTvSeriesRecommendations(seriesId, language, page);
  }

  @Cacheable(cacheNames = TvSeriesCacheConfigurer.TV_SERIES_SIMILAR)
  public TvSeriesSimilarModel getTvSeriesSimilar(long seriesId, String language, int page) {
    return tvSeriesRequests.getTvSeriesSimilar(seriesId, language, page);
  }

  @Cacheable(cacheNames = TvSeriesCacheConfigurer.TV_SERIES_VIDEOS)
  public VideosModel getTvSeriesVideos(long seriesId, String language) {
    return tvSeriesRequests.getTvSeriesVideos(seriesId, language);
  }
}

