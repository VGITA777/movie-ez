package dev.prince.movieez.media.models.tvseries;


import dev.prince.movieez.media.models.enums.MediaType;
import java.util.List;
import lombok.NoArgsConstructor;

/**
 * Response model for The Movie Database (TMDB) API's TV series latest endpoint. Returns the most recently created TV
 * series. This is live data and will continuously change.
 *
 * @see <a href="https://developer.themoviedb.org/reference/tv-series-latest-id">Tv Series Latest API Reference</a>
 */
@NoArgsConstructor
public class TvSeriesLatestModel extends TvSeriesDetailsModel {

  public TvSeriesLatestModel(
      String first_air_date,
      List<CreatedBy> created_by,
      List<Integer> episode_run_time,
      boolean in_production,
      List<String> languages,
      String last_air_date,
      LastEpisodeToAir last_episode_to_air,
      String name,
      NextEpisodeToAir next_episode_to_air,
      List<Network> networks,
      int number_of_episodes,
      int number_of_seasons,
      List<String> origin_country,
      String original_name,
      List<Season> seasons,
      String type
  ) {
    super(
        first_air_date,
        created_by,
        episode_run_time,
        in_production,
        languages,
        last_air_date,
        last_episode_to_air,
        name,
        next_episode_to_air,
        networks,
        number_of_episodes,
        number_of_seasons,
        origin_country,
        original_name,
        seasons,
        type,
        MediaType.TV
    );
  }
}
