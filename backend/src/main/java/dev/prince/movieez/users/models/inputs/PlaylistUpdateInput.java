package dev.prince.movieez.users.models.inputs;

import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import java.util.Set;
import org.hibernate.validator.constraints.Length;

public record PlaylistUpdateInput(@Nullable
                                  @Length(min = 1, max = 25, message = "{validation.playlist.nameLength.message}")
                                  String newName,
    /*
     * Full replacement list.
     * Every added/replaced item requires trackId + mediaType + addedOn.
     */
                                  @Nullable
                                  @Valid
                                  Set<PlaylistTrackInfoInput> newTracks,
    /*
     * Removal only needs identity: trackId + mediaType.
     */
                                  @Nullable
                                  @Valid
                                  Set<PlaylistTrackIdentityInput> tracksToRemove,
    /*
     * Incremental additions.
     * Every item requires trackId + mediaType + addedOn.
     */
                                  @Nullable
                                  @Valid
                                  Set<PlaylistTrackInfoInput> tracksToAdd) {

}