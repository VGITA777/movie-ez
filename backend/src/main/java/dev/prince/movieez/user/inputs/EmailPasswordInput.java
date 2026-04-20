package dev.prince.movieez.user.inputs;

import dev.prince.movieez.user.validators.annotations.Password;
import dev.prince.movieez.user.validators.annotations.Required;
import jakarta.validation.constraints.Email;

public record EmailPasswordInput(@Required(fieldName = "email")
                                 @Email
                                 String email,
                                 @Required(fieldName = "password")
                                 @Password
                                 String password) {

}
