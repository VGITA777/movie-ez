package dev.prince.movieez.users.models.inputs;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.hibernate.validator.constraints.Length;

public record PlaylistInput(@NotNull(message = "{validation.playlist.id.notNull}")
                            UUID id,

                            @NotBlank(message = "{validation.playlist.name.notBlank}")
                            @Length(min = 1, max = 25, message = "{validation.playlist.nameLength.message}")
                            String name,

                            @NotNull(message = "{validation.playlist.createdOn.notNull}")
                            Instant createdOn,

                            @Valid
                            @NotNull(message = "{validation.playlist.trackList.notNull}")
                            List<PlaylistTrackInfoInput> tracks) {

}