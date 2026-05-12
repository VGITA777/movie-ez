package dev.prince.movieez.users.sync;

import dev.prince.movieez.users.models.models.OfflinePlaylistModel;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(3)
public class CreatePlaylistSyncStrategy implements PlaylistSyncStrategy {

  private final PlaylistSyncSupport support;

  public CreatePlaylistSyncStrategy(PlaylistSyncSupport support) {
    this.support = support;
  }

  @Override
  public boolean supports(OfflinePlaylistModel offline, PlaylistSyncContext context) {
    if (offline == null || support.isDeleted(offline) || !support.hasValidName(offline.getName())) {
      return false;
    }

    if (offline.getId() != null && context
        .getRemoteById()
        .containsKey(offline.getId())) {
      return false;
    }

    var key = support.normalizeName(offline.getName());

    return key == null || !context
        .getRemoteActiveByName()
        .containsKey(key);
  }

  @Override
  public void apply(OfflinePlaylistModel offline, PlaylistSyncContext context) {
    var created = support.createFromOffline(offline, context.getUser());

    context
        .getRemoteById()
        .put(created.getId(), created);

    if (!support.isDeleted(created) && support.hasValidName(created.getName())) {
      context
          .getRemoteActiveByName()
          .put(support.normalizeName(created.getName()), created);
    }
  }
}