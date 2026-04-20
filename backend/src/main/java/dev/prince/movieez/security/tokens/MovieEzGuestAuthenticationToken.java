package dev.prince.movieez.security.tokens;

import dev.prince.movieez.security.ratelimit.RateLimiterUserRoles;
import java.util.List;
import org.jspecify.annotations.Nullable;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public class MovieEzGuestAuthenticationToken extends AbstractAuthenticationToken {

  public MovieEzGuestAuthenticationToken() {
    super(List.of(new SimpleGrantedAuthority(RateLimiterUserRoles.GUEST.name())));
  }

  @Override
  public @Nullable Object getCredentials() {
    return null;
  }

  @Override
  public @Nullable Object getPrincipal() {
    return null;
  }

  @Override
  public boolean isAuthenticated() {
    return true;
  }
}
