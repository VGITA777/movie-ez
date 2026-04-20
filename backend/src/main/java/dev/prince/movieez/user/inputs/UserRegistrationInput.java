package dev.prince.movieez.user.inputs;

import dev.prince.movieez.user.validators.annotations.Password;
import dev.prince.movieez.user.validators.annotations.Required;
import dev.prince.movieez.user.validators.annotations.Username;
import jakarta.validation.constraints.Email;

public record UserRegistrationInput(@Required(fieldName = "username")
                                    @Username
                                    String username,
                                    @Required(fieldName = "email")
                                    @Email
                                    String email,
                                    @Required(fieldName = "password")
                                    @Password
                                    String password) {

}
