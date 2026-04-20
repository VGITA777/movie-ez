package dev.prince.movieez.user.inputs;

import dev.prince.movieez.user.validators.annotations.Password;
import dev.prince.movieez.user.validators.annotations.Required;
import dev.prince.movieez.user.validators.annotations.Username;

public record UsernamePasswordInput(@Required(fieldName = "username")
                                    @Username
                                    String username,
                                    @Required(fieldName = "password")
                                    @Password
                                    String password) {

}
