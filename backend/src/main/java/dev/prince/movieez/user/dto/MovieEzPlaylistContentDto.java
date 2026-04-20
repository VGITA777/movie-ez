package dev.prince.movieez.user.dto;

import java.util.UUID;

/**
 * A DTO object representing a single content from a playlist.
 *
 * @param id       the {@link UUID} of the content.
 * @param playlist the {@link UUID} of the playlist where the content is from.
 * @param trackId  the ID of the track.
 */
public record MovieEzPlaylistContentDto(UUID id,
                                        UUID playlist,
                                        String trackId) {

}
