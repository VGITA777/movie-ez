package dev.prince.movieez.media.models.movies;

import dev.prince.movieez.media.json.deserializers.StringToMediaTypeDeserializer;
import dev.prince.movieez.media.json.serializers.MediaTypeToStringSerializer;
import dev.prince.movieez.media.models.enums.MediaType;
import dev.prince.movieez.media.models.shared.MediaDetailsModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import tools.jackson.databind.annotation.JsonDeserialize;
import tools.jackson.databind.annotation.JsonSerialize;

/**
 * Response model for The Movie Database (TMDB) API's movie details endpoint. Contains detailed information about a
 * specific movie including its basic info, production details, and statistics.
 *
 * @see <a href="https://developer.themoviedb.org/reference/movie-details">Movie Details API Reference</a>
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieDetailsModel extends MediaDetailsModel {

  private BelongsToCollection belongs_to_collection;
  private long budget;
  private String imdb_id;
  private String original_title;
  private String release_date;
  private long revenue;
  private int runtime;
  private String title;
  private boolean video;
  @Builder.Default
  @JsonDeserialize(using = StringToMediaTypeDeserializer.class)
  @JsonSerialize(using = MediaTypeToStringSerializer.class)
  private MediaType media_type = MediaType.MOVIE;

  @Data
  public static class BelongsToCollection {

    private long id;
    private String name;
    private String poster_path;
    private String backdrop_path;
  }

}
