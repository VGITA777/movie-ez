package dev.prince.movieez.users.models.inputs;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

/*
 * Used for adding many playlist contents.
 */
public record PlaylistTracksInput(@Valid
                                  @NotNull(message = "{validation.playlist.trackList.notNull}")
                                  List<PlaylistTrackInfoInput> tracks) {

}