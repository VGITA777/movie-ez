package dev.prince.movieez.users;

import lombok.Getter;
import org.jspecify.annotations.Nullable;

@Getter
public enum UserRole {
  GUEST(0), USER(1), ADMIN(Integer.MAX_VALUE);

  private final int priority;

  UserRole(int priority) {
    this.priority = priority;
  }

  public static UserRole fromRole(@Nullable String role) {
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
