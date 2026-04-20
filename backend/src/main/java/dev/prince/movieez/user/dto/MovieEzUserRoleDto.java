package dev.prince.movieez.user.dto;

import dev.prince.movieez.user.models.MovieEzAppRole;
import java.util.UUID;

/**
 * A DTO object representing a role of a user.
 *
 * @param id          the {@link UUID} of the content.
 * @param description the {@link MovieEzAppRole}.
 */
public record MovieEzUserRoleDto(UUID id,
                                 MovieEzAppRole description) {

}
