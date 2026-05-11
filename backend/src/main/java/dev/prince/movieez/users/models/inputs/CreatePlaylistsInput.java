package dev.prince.movieez.users.models.inputs;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record CreatePlaylistsInput(@NotNull
                                   List<PlaylistInput> playlists) {

}
