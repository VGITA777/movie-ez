package dev.prince.movieez.users.models.models;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record OfflinePlaylistModel(UUID id,
                                   String name,
                                   List<OfflinePlaylistContentModel> items,
                                   Instant lastEditTimestamp,
                                   Instant deletedOn) {

}
