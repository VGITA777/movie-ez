package dev.prince.movieez.security.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record PlaylistDto(UUID id,
                          UUID userId,
                          String name,
                          Instant lastEditTimestamp,
                          Instant deletedOn,
                          List<PlaylistContentDto> items) {

}

