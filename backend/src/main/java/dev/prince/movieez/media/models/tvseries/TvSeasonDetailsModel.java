 package dev.prince.movieez.media.models.tvseries;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response model for The Movie Database (TMDB) API's TV season details endpoint.
 *
 * @see <a href="https://developer.themoviedb.org/reference/tv-season-details">TV Season Details API Reference</a>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TvSeasonDetailsModel {

  private String _id;
  private String air_date;
  private List<Episode> episodes;
  private String name;
  private String overview;
  private long id;
  private String poster_path;
  private int season_number;
  private double vote_average;

  @Data
  public static class Episode {

    private String air_date;
    private int episode_number;
    private long id;
    private String name;
    private String overview;
    private String production_code;
    private Integer runtime;
    private int season_number;
    private String still_path;
    private double vote_average;
    private Integer vote_count;
    private long show_id;
    private List<EpisodeCrew> crew;
    private List<EpisodeGuestStar> guest_stars;
  }

  @Data
  public static class EpisodeCrew {

    private boolean adult;
    private int gender;
    private long id;
    private String known_for_department;
    private String name;
    private String original_name;
    private double popularity;
    private String profile_path;
    private String credit_id;
    private String department;
    private String job;
  }

  @Data
  public static class EpisodeGuestStar {

    private boolean adult;
    private int gender;
    private long id;
    private String known_for_department;
    private String name;
    private String original_name;
    private double popularity;
    private String profile_path;
    private String credit_id;
    private String character;
    private int order;
  }
}

