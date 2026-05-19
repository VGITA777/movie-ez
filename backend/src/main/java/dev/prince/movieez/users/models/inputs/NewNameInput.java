package dev.prince.movieez.users.models.inputs;

import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.Length;

public record NewNameInput(@Length(min = 1, max = 25, message = "{validation.playlist.nameLength.message}")
                           @NotBlank(message = "{validation.playlist.name.notBlank}")
                           String name) {

}