package dev.prince.movieez.security.dto;

import dev.prince.movieez.media.models.enums.MediaType;
import java.util.UUID;

public record PlaylistContentDto(UUID id,
                                 UUID playlistId,
                                 MediaType mediaType,
                                 String trackId) {

}

