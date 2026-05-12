package dev.prince.movieez.users.models.responses;

import java.util.UUID;

public record PlaylistIdMapping(UUID localId,
                                UUID canonicalServerId) {

}