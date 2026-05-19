package dev.prince.movieez.users.models.models;

import dev.prince.movieez.media.models.enums.MediaType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Client/offline playlist content used during sync.
 * <p>
 * TMDB IDs are not globally unique across media types. Example: - movie 123 - tv 123
 * <p>
 * Therefore, playlist content identity is trackId + mediaType.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OfflinePlaylistContentModel {

  @NotBlank(message = "{validation.playlist.trackId.notBlank}")
  private String trackId;

  @NotNull(message = "{validation.playlist.mediaType.notNull}")
  private MediaType mediaType;

  @NotNull(message = "{validation.playlist.addedOn.notNull}")
  private Instant addedOn;
}