package dev.prince.movieez.user.inputs;

import dev.prince.movieez.user.validators.annotations.Required;
import dev.prince.movieez.user.validators.annotations.Username;

public record UpdateUsernameInput(@Required(fieldName = "username")
                                  @Username
                                  String username) {

}
