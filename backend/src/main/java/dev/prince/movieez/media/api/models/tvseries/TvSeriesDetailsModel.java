package dev.prince.movieez.media.api.models.tvseries;

import dev.prince.movieez.media.api.json.deserializers.StringToMediaTypeDeserializer;
import dev.prince.movieez.media.api.json.serailizers.MediaTypeToStringSerializer;
import dev.prince.movieez.media.api.models.enums.MediaType;
import dev.prince.movieez.media.api.models.shared.MediaDetailsModel;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;
import tools.jackson.databind.annotation.JsonDeserialize;
import tools.jackson.databind.annotation.JsonSerialize;

/**
 * Response model for The Movie Database (TMDB) API's TV series details endpoint. Contains detailed information about a
 * specific TV series including its basic info, production details, and statistics.
 *
 * @see <a href="https://developer.themoviedb.org/reference/tv-series-details">TV Series Details API Reference</a>
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class TvSeriesDetailsModel extends MediaDetailsModel {

  private String first_air_date;
  private List<CreatedBy> created_by;
  private List<Integer> episode_run_time;
  private boolean in_production;
  private List<String> languages;
  private String last_air_date;
  private LastEpisodeToAir last_episode_to_air;
  private String name;
  private NextEpisodeToAir next_episode_to_air;
  private List<Network> networks;
  private int number_of_episodes;
  private int number_of_seasons;
  private List<String> origin_country;
  private String original_name;
  private List<Season> seasons;
  private String type;
  @JsonDeserialize(using = StringToMediaTypeDeserializer.class)
  @JsonSerialize(using = MediaTypeToStringSerializer.class)
  private MediaType media_type = MediaType.TV;

  // Submodels
  @Data
  public static class CreatedBy {

    private long id;
    private String credit_id;
    private String name;
    private int gender;
    private String profile_path;
  }

  @Data
  public static class LastEpisodeToAir {

    private String air_date;
    private int episode_number;
    private long id;
    private String name;
    private String overview;
    private String production_code;
    private int runtime;
    private int season_number;
    private String show_id;
    private String still_path;
    private double vote_average;
    private int vote_count;
  }

  @Data
  public static class NextEpisodeToAir {

    private String air_date;
    private int episode_number;
    private long id;
    private String name;
    private String overview;
    private String production_code;
    private int runtime;
    private int season_number;
    private String show_id;
    private String still_path;
    private double vote_average;
    private int vote_count;
  }

  @Data
  public static class Network {

    private long id;
    private String name;
    private String logo_path;
    private String origin_country;
  }

  @Data
  public static class Season {

    private String air_date;
    private int episode_count;
    private long id;
    private String name;
    private String overview;
    private String poster_path;
    private int season_number;
    private double vote_average;
  }
}
