package dev.prince.movieez.users.models.inputs;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

/*
 * Used for removing many playlist contents.
 */
public record PlaylistTrackIdentitiesInput(
    @Valid
    @NotNull(message = "{validation.playlist.trackList.notNull}")
    List<PlaylistTrackIdentityInput> tracks
) {
}