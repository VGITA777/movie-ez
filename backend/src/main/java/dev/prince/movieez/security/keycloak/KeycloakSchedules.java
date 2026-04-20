package dev.prince.movieez.security.keycloak;

import dev.prince.movieez.user.models.MovieEzUserModel;
import dev.prince.movieez.user.repository.MovieEzUserRepository;
import jakarta.transaction.Transactional;
import java.util.LinkedList;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class KeycloakSchedules {

  private final MovieEzUserRepository userRepository;
  private final KeycloakMovieEzUserClient keycloakMovieEzUserClient;
  private static final int USER_FETCH_BATCH_SIZE = 100;

  public KeycloakSchedules(MovieEzUserRepository userRepository, KeycloakMovieEzUserClient keycloakMovieEzUserClient) {
    this.userRepository = userRepository;
    this.keycloakMovieEzUserClient = keycloakMovieEzUserClient;
  }

  @Transactional
  @Scheduled(cron = "0 */5 * * * *")
  public void syncKeycloakUsers() {
    log.info("Syncing Keycloak users");
    var userRepresentationStream = keycloakMovieEzUserClient.batchedUsers(USER_FETCH_BATCH_SIZE);
    try {
      handleSavingUsers(userRepresentationStream);
    } catch (Exception e) {
      log.error("Error occurred while syncing Keycloak users", e);
      return;
    }
    log.info("Finished syncing Keycloak users");
  }

  private void handleSavingUsers(Stream<UserRepresentation> keycloakUsers) {
    var mappedKeycloakUsers = keycloakUsers
        .map(this::convertToUserModel)
        .toList();
    var userIds = mappedKeycloakUsers
        .stream()
        .map(MovieEzUserModel::getId)
        .toList();
    var usersFromLocalDb = userRepository
        .findAllById(userIds)
        .stream()
        .collect(Collectors.toMap(MovieEzUserModel::getId, Function.identity()));
    var toBeSavedUsers = new LinkedList<MovieEzUserModel>();

    mappedKeycloakUsers.forEach(user -> {
      var userId = user.getId();
      var userFromLocalDb = usersFromLocalDb.get(userId);

      // If the user does not exist, or it exists, but changes are found, then add to toBeSavedUsers list
      if (Objects.isNull(userFromLocalDb) || !Objects.equals(userFromLocalDb, user)) {
        toBeSavedUsers.add(user);
      }
    });

    log.info("Syncing {} changed users to the database", toBeSavedUsers.size());
    userRepository.saveAll(toBeSavedUsers);
  }

  private MovieEzUserModel convertToUserModel(UserRepresentation userRepresentation) {
    return MovieEzUserModel
        .builder()
        .id(UUID.fromString(userRepresentation.getId()))
        .username(userRepresentation.getUsername())
        .email(userRepresentation.getEmail())
        .enabled(userRepresentation.isEnabled())
        .build();
  }
}
