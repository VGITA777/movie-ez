package dev.prince.movieez.users.models.inputs;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import org.hibernate.validator.constraints.Length;

public record PlaylistInput(@Length(min = 1, max = 100, message = "{validation.length.message}")
                                String name,
                            @NotNull
                                List<String> trackIds) {

}
