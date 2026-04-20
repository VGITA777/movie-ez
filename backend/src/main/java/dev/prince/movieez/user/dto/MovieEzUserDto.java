package dev.prince.movieez.user.dto;

import java.util.List;
import java.util.UUID;

/**
 * A DTO object representing a user.
 *
 * @param id        the {@link UUID} of the content.
 * @param username  the username of the user.
 * @param email     the email of the user.
 * @param playlists a list of {@link MovieEzUserPlaylistSummaryDto}.
 * @param roles     a list of {@link MovieEzUserRoleDto}.
 */
public record MovieEzUserDto(UUID id,
                             String username,
                             String email,
                             List<MovieEzUserPlaylistSummaryDto> playlists,
                             List<MovieEzUserRoleDto> roles) {

}
