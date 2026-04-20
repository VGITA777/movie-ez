package dev.prince.movieez.user.dto;

import java.util.List;
import java.util.UUID;

/**
 * A DTO object representing a playlist of a user.
 *
 * @param id       the {@link UUID} of the content.
 * @param user     the {@link UUID} of the user.
 * @param name     the name of the playlist.
 * @param contents a list of {@link MovieEzPlaylistContentSummaryDto}
 */
public record MovieEzUserPlaylistDto(UUID id,
                                     UUID user,
                                     String name,
                                     List<MovieEzPlaylistContentSummaryDto> contents) {

}
