package dev.prince.movieez.user.dto;

import java.util.UUID;

/**
 * A DTO object representing a summarized version of a content from a playlist.
 *
 * @param id      the {@link UUID} of the content.
 * @param trackId the ID of the track.
 */
public record MovieEzPlaylistContentSummaryDto(UUID id,
                                               String trackId) {

}
