package dev.prince.movieez.security.ratelimit;

import dev.prince.movieez.shared.models.UserIdentifierModel;
import java.io.Serial;
import java.io.Serializable;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RateLimiterIdentifier implements Serializable {

  @Serial
  private static final long serialVersionUID = 1L;

  private String id;
  private RateLimiterUserRoles role;
  private UserIdentifierModel details;

  @Override
  public int hashCode() {
    return Objects.hash(id, role, details);
  }

  @Override
  public boolean equals(Object o) {
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    RateLimiterIdentifier that = (RateLimiterIdentifier) o;
    return Objects.equals(id, that.id) && role == that.role && Objects.equals(details, that.details);
  }
}

