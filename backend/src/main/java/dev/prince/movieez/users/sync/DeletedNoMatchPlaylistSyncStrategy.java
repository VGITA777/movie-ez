package dev.prince.movieez.users.sync;

import dev.prince.movieez.users.models.models.OfflinePlaylistModel;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(4)
public class DeletedNoMatchPlaylistSyncStrategy implements PlaylistSyncStrategy {

  private final PlaylistSyncSupport support;

  public DeletedNoMatchPlaylistSyncStrategy(PlaylistSyncSupport support) {
    this.support = support;
  }

  @Override
  public boolean supports(OfflinePlaylistModel offline, PlaylistSyncContext context) {
    return offline != null && support.isDeleted(offline);
  }

  @Override
  public void apply(OfflinePlaylistModel offline, PlaylistSyncContext context) {
    /*
     * No-op.
     *
     * A deleted local playlist that does not exist on the server does not need
     * to be created as a tombstone.
     */
  }
}