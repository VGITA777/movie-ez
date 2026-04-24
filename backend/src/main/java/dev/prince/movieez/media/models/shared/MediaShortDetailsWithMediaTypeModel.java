package dev.prince.movieez.media.models.shared;

import dev.prince.movieez.media.json.deserializers.StringToMediaTypeDeserializer;
import dev.prince.movieez.media.json.serializers.MediaTypeToStringSerializer;
import dev.prince.movieez.media.models.enums.MediaType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import tools.jackson.databind.annotation.JsonDeserialize;
import tools.jackson.databind.annotation.JsonSerialize;

/**
 * Base model for short details of media (movies and TV series) with media type information. Extends
 * MediaShortDetailsModel and adds media type information.
 *
 * @see <a href="https://developer.themoviedb.org/reference/movie-details">Movie Details API Reference</a>
 * @see <a href="https://developer.themoviedb.org/reference/tv-series-details">TV Series Details API Reference</a>
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class MediaShortDetailsWithMediaTypeModel extends MediaShortDetailsModel {

  @JsonDeserialize(using = StringToMediaTypeDeserializer.class)
  @JsonSerialize(using = MediaTypeToStringSerializer.class)
  private MediaType media_type;
}
