package dev.prince.movieez.users.models.models;

import dev.prince.movieez.media.models.enums.MediaType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OfflinePlaylistContentModel {

  /*
   * TMDB IDs are not globally unique across media types.
   *
   * Example:
   * - movie id 123
   * - tv id 123
   *
   * Because of that, playlist content identity must be:
   * trackId + mediaType
   */
  private String trackId;

  /*
   * Default to MOVIE for older local data that was created before mediaType existed.
   */
  @Builder.Default
  private MediaType mediaType = MediaType.MOVIE;
}