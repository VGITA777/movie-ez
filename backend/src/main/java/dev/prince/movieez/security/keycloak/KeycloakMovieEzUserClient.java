package dev.prince.movieez.security.keycloak;


import java.util.Collection;
import java.util.stream.Stream;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Component;

@Component
public class KeycloakMovieEzUserClient {

  public final Keycloak keycloak;
  private final UsersResource usersResource;

  public KeycloakMovieEzUserClient(Keycloak keycloak) {
    this.keycloak = keycloak;
    var realmResource = keycloak.realm("movie-ez");
    this.usersResource = realmResource.users();
  }

  public Stream<UserRepresentation> batchedUsers(int perBatch) {
    return Stream
        .iterate(0, offset -> offset + perBatch)
        .map(offset -> usersResource.list(offset, perBatch))
        .takeWhile(data -> !data.isEmpty())
        .flatMap(Collection::stream);
  }
}
