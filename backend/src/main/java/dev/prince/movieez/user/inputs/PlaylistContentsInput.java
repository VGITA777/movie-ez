package dev.prince.movieez.user.inputs;

import dev.prince.movieez.user.validators.annotations.ListRegexMatch;
import dev.prince.movieez.user.validators.annotations.Required;
import java.util.List;

public record PlaylistContentsInput(@Required(fieldName = "trackIds")
                                    @ListRegexMatch(
                                        matchAll = true,
                                        patterns = { "^[a-zA-Z0-9]+$" },
                                        message = "trackIds must be alphanumeric strings"
                                    )
                                    List<String> trackIds) {

}
