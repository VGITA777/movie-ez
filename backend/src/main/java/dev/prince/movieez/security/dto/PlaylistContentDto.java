package dev.prince.movieez.security.dto;

import dev.prince.movieez.media.models.enums.MediaType;
import java.time.Instant;
import java.util.UUID;

public record PlaylistContentDto(UUID id,
                                 UUID playlistId,
                                 String trackId,
                                 MediaType mediaType,
                                 Instant addedOn) {

}