package dev.prince.movieez.user.inputs;

import dev.prince.movieez.user.validators.annotations.Password;
import dev.prince.movieez.user.validators.annotations.Required;

public record PasswordInput(@Required(fieldName = "password")
                            @Password
                            String password) {

}
