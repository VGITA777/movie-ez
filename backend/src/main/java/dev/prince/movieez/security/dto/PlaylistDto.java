package dev.prince.movieez.security.dto;

import java.util.List;
import java.util.UUID;

public record PlaylistDto(UUID id,
                          UUID userId,
                          String name,
                          List<PlaylistContentDto> items) {

}

