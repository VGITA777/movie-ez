package dev.prince.movieez.users.models.models;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Client/offline version of a playlist used during sync.
 * <p>
 * createdOn is mandatory because offline-created playlists must preserve their original creation timestamp when
 * uploaded to the server.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OfflinePlaylistModel {

  private UUID id;

  @NotBlank(message = "{validation.playlist.name.notBlank}")
  private String name;

  @Valid
  @NotNull(message = "{validation.playlist.items.notNull}")
  private List<OfflinePlaylistContentModel> items;

  @NotNull(message = "{validation.playlist.createdOn.notNull}")
  private Instant createdOn;

  @NotNull(message = "{validation.playlist.lastEditTimestamp.notNull}")
  private Instant lastEditTimestamp;

  private Instant deletedOn;
}