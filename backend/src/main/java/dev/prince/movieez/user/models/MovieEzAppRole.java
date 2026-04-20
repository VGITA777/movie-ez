package dev.prince.movieez.user.models;

import lombok.Getter;
import org.jspecify.annotations.Nullable;

/**
 * An enum of available roles.
 */
@Getter
public enum MovieEzAppRole {
  GUEST(0), USER(1), ADMIN(Integer.MAX_VALUE);

  private final int priority;

  MovieEzAppRole(int priority) {
    this.priority = priority;
  }

  public static MovieEzAppRole fromRole(@Nullable String role) {
    if (role == null) {
      return GUEST;
    }

    return switch (role) {
      case "ROLE_ADMIN" -> ADMIN;
      case "ROLE_USER" -> USER;
      default -> GUEST;
    };
  }
}
