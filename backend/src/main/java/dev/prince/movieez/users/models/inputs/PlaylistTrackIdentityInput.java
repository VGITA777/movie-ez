package dev.prince.movieez.users.models.inputs;

import dev.prince.movieez.media.models.enums.MediaType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/*
 * Used when removing playlist contents.
 *
 * addedOn is not needed for deletion because deletion only needs the content identity:
 * trackId + mediaType.
 */
public record PlaylistTrackIdentityInput(
    @NotBlank(message = "{validation.playlist.trackId.notBlank}")
    String trackId,

    @NotNull(message = "{validation.playlist.mediaType.notNull}")
    MediaType mediaType
) {
}