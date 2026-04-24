package dev.prince.movieez.security.dto;

import java.util.UUID;

public record PlaylistContentDto(UUID id,
                                 UUID playlistId,
                                 String trackId) {

}

