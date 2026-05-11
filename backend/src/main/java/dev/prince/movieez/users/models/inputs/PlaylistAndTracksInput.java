package dev.prince.movieez.users.models.inputs;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record PlaylistAndTracksInput(@NotNull(message = "{validation.playlist.id.notNull}")
                                  UUID playlistId,
                                     @NotNull(message = "{validation.playlist.trackList.notNull}")
                                  List<String> trackIds) {

}
