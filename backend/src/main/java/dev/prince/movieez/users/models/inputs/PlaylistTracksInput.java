package dev.prince.movieez.users.models.inputs;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record PlaylistTracksInput(@NotNull(message = "{validation.playlist.trackList.notNull}")
                                  List<String> tracksIds) {

}
