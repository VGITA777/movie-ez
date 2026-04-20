package dev.prince.movieez.shared.models;

import dev.prince.movieez.user.models.MovieEzUserModel;
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
public record UserIdentifierModel(UUID id,
                                  String username,
                                  String email) implements Serializable {

  @Serial
  private static final long serialVersionUID = 1L;

  public static UserIdentifierModel of(MovieEzUserModel movieEzUserModel) {
    return new UserIdentifierModel(
        movieEzUserModel.getId(),
                                   movieEzUserModel.getUsername(),
                                   movieEzUserModel.getEmail()
    );
  }

  public static UserIdentifierModel of(Jwt jwt) {
    return new UserIdentifierModel(
        UUID.fromString(jwt.getSubject()),
                                   jwt.getClaimAsString("preferred_username"),
                                   jwt.getClaimAsString("email")
    );
  }
}
