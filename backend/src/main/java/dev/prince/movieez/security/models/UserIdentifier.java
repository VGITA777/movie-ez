package dev.prince.movieez.security.models;

import java.io.Serial;
import java.io.Serializable;
import java.util.UUID;
import org.springframework.security.oauth2.jwt.Jwt;

/**
 * A model that should be used as the Principal for a fully authenticated user.
 *
 * @param id       the {@link UUID} of the user.
 * @param username the username of the user.
 * @param email    the email of the user.
 */
public record UserIdentifier(UUID id,
                             String username,
                             String email) implements Serializable {

  @Serial
  private static final long serialVersionUID = 1L;

  public static UserIdentifier of(UserModel movieEzUserModelModel) {
    return new UserIdentifier(
        movieEzUserModelModel.getId(),
                              movieEzUserModelModel.getUsername(),
                              movieEzUserModelModel.getEmail()
    );
  }

  public static UserIdentifier of(Jwt jwt) {
    return new UserIdentifier(
        UUID.fromString(jwt.getSubject()),
                                   jwt.getClaimAsString("preferred_username"),
                                   jwt.getClaimAsString("email")
    );
  }
}
