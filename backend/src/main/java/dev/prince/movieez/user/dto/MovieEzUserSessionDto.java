package dev.prince.movieez.user.dto;

import java.time.Instant;

/**
 * A DTO object representing an active session of a user.
 *
 * @param id               the ID of the session.
 * @param creationTime     a {@link Instant} representing the creation time of a session.
 * @param lastAccessedTime a {@link Instant} representing the last accessed time of a session.
 * @param expired          whether a session is expired or not.
 */
public record MovieEzUserSessionDto(String id,
                                    Instant creationTime,
                                    Instant lastAccessedTime,
                                    boolean expired) {

}
