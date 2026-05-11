package dev.prince.movieez.users.models.inputs;

import jakarta.annotation.Nullable;
import java.util.Set;
import org.hibernate.validator.constraints.Length;

public record PlaylistUpdateInput(@Nullable
                                  @Length(min = 1, max = 100, message = "{validation.length.message}")
                                  String newName,
                                  @Nullable
                                  Set<String> newTracks,
                                  @Nullable
                                  Set<String> tracksToRemove,
                                  @Nullable
                                  Set<String> tracksToAdd) {

}
