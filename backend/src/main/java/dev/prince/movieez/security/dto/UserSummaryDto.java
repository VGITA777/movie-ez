package dev.prince.movieez.security.dto;

import java.util.UUID;

public record UserSummaryDto(UUID id,
                             String username,
                             String email) {

}
