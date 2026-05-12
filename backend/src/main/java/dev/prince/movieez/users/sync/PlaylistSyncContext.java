package dev.prince.movieez.users.sync;

import dev.prince.movieez.security.models.PlaylistModel;
import dev.prince.movieez.security.models.UserModel;
import dev.prince.movieez.users.models.responses.PlaylistIdMapping;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class PlaylistSyncContext {

  private final Map<UUID, PlaylistModel> remoteById;
  private final Map<String, PlaylistModel> remoteActiveByName;
  private final UserModel user;
  private final List<PlaylistIdMapping> idMappings = new ArrayList<>();

  public PlaylistSyncContext(
      Map<UUID, PlaylistModel> remoteById,
      Map<String, PlaylistModel> remoteActiveByName,
      UserModel user
  ) {
    this.remoteById = remoteById;
    this.remoteActiveByName = remoteActiveByName;
    this.user = user;
  }

  public Map<UUID, PlaylistModel> getRemoteById() {
    return remoteById;
  }

  public Map<String, PlaylistModel> getRemoteActiveByName() {
    return remoteActiveByName;
  }

  public UserModel getUser() {
    return user;
  }

  public List<PlaylistIdMapping> getIdMappings() {
    return idMappings;
  }

  public void addIdMapping(UUID localId, UUID canonicalServerId) {
    if (localId == null || canonicalServerId == null || localId.equals(canonicalServerId)) {
      return;
    }

    idMappings.add(new PlaylistIdMapping(localId, canonicalServerId));
  }
}