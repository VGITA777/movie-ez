package dev.prince.movieez.users.sync;

import dev.prince.movieez.security.models.PlaylistModel;
import dev.prince.movieez.users.models.models.OfflinePlaylistModel;
import java.time.Instant;
import java.util.Objects;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class SameIdPlaylistSyncStrategy implements PlaylistSyncStrategy {

  private final PlaylistSyncSupport support;

  public SameIdPlaylistSyncStrategy(PlaylistSyncSupport support) {
    this.support = support;
  }

  @Override
  public boolean supports(OfflinePlaylistModel offline, PlaylistSyncContext context) {
    return offline != null
        && offline.getId() != null
        && context.getRemoteById().containsKey(offline.getId());
  }

  @Override
  public void apply(OfflinePlaylistModel offline, PlaylistSyncContext context) {
    PlaylistModel remote = context.getRemoteById().get(offline.getId());

    var offlineDeleted = support.isDeleted(offline);
    var remoteDeleted = support.isDeleted(remote);

    if (offlineDeleted && remoteDeleted) {
      mergeDeletedTombstones(offline, remote);
      return;
    }

    if (offlineDeleted) {
      softDeleteRemote(offline, remote, context);
      return;
    }

    if (remoteDeleted) {
      /*
       * Server tombstone wins.
       * The returned synced payload tells the client to delete/hide this playlist locally.
       */
      return;
    }

    mergeActiveSameId(offline, remote, context);
  }

  private void mergeDeletedTombstones(OfflinePlaylistModel offline, PlaylistModel remote) {
    var newestDeletedOn = support.maxInstant(remote.getDeletedOn(), offline.getDeletedOn());

    if (newestDeletedOn != null && !Objects.equals(newestDeletedOn, remote.getDeletedOn())) {
      remote.setDeletedOn(newestDeletedOn);
      support.saveAndRefresh(remote);
    }
  }

  private void softDeleteRemote(
      OfflinePlaylistModel offline,
      PlaylistModel remote,
      PlaylistSyncContext context
  ) {
    remote.setDeletedOn(offline.getDeletedOn() != null ? offline.getDeletedOn() : Instant.now());

    support.removeActiveName(remote, context);
    support.saveAndRefresh(remote);
  }

  private void mergeActiveSameId(
      OfflinePlaylistModel offline,
      PlaylistModel remote,
      PlaylistSyncContext context
  ) {
    var offlineTimestamp = offline.getLastEditTimestamp();
    var remoteTimestamp = remote.getLastEditTimestamp();

    /*
     * If remote is newer or equal, keep the server version.
     * If client is newer, replace mutable fields from offline:
     * - name
     * - playlist contents
     *
     * createdOn is not replaced because it is creation metadata.
     */
    if (support.compareInstants(offlineTimestamp, remoteTimestamp) <= 0) {
      return;
    }

    support.replaceRemoteWithOffline(remote, offline, context);
    support.saveAndRefresh(remote);
  }
}