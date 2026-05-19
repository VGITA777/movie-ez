package dev.prince.movieez.users.models.inputs;

import dev.prince.movieez.media.models.enums.MediaType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

/*
 * Used when adding or replacing playlist contents.
 *
 * addedOn is required here because this input creates playlist content rows.
 */
public record PlaylistTrackInfoInput(
    @NotBlank(message = "{validation.playlist.trackId.notBlank}")
    String trackId,

    @NotNull(message = "{validation.playlist.mediaType.notNull}")
    MediaType mediaType,

    @NotNull(message = "{validation.playlist.addedOn.notNull}")
    Instant addedOn
) {
}