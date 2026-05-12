package dev.prince.movieez.users.models.inputs;

import dev.prince.movieez.users.models.models.OfflinePlaylistModel;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record PlaylistSyncInput(@NotNull(message = "Playlists sync cannot be null")
                                List<OfflinePlaylistModel> playlists) {

}
