package dev.prince.movieez.user.dto;

import java.util.UUID;

/**
 * A DTO object representing a summarized version of a user's playlist.
 *
 * @param id   the {@link UUID} of the content.
 * @param name the name of the playlist.
 */
public record MovieEzUserPlaylistSummaryDto(UUID id,
                                            String name) {

}
