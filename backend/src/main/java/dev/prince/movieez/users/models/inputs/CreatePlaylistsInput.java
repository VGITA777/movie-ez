package dev.prince.movieez.users.models.inputs;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record CreatePlaylistsInput(@Valid
                                   @NotNull(message = "{validation.playlist.createInput.notNull}")
                                   List<PlaylistInput> playlists) {

}