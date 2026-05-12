package dev.prince.movieez.users.models.models;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OfflinePlaylistModel {

  private UUID id;
  private String name;
  private List<OfflinePlaylistContentModel> items;
  private Instant lastEditTimestamp;
  private Instant deletedOn;

}
