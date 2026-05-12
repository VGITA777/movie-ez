package dev.prince.movieez.users.models.responses;

import dev.prince.movieez.security.dto.PlaylistDto;
import java.time.Instant;
import java.util.List;

public record PlaylistSyncResponse(List<PlaylistDto> playlists,
                                   List<PlaylistIdMapping> idMappings,
                                   Instant serverSyncedAt) {

}