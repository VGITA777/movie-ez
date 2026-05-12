package dev.prince.movieez.users.sync;

import dev.prince.movieez.users.models.models.OfflinePlaylistModel;
import java.util.Objects;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class SameActiveNameDifferentIdsPlaylistSyncStrategy implements PlaylistSyncStrategy {

  private final PlaylistSyncSupport support;

  public SameActiveNameDifferentIdsPlaylistSyncStrategy(PlaylistSyncSupport support) {
    this.support = support;
  }

  @Override
  public boolean supports(OfflinePlaylistModel offline, PlaylistSyncContext context) {
    if (offline == null || support.isDeleted(offline) || !support.hasValidName(offline.getName())) {
      return false;
    }

    var key = support.normalizeName(offline.getName());
    var remoteByName = key != null ? context
                                     .getRemoteActiveByName()
                                     .get(key) : null;

    return remoteByName != null && (offline.getId() == null || !Objects.equals(remoteByName.getId(), offline.getId()));
  }

  @Override
  public void apply(OfflinePlaylistModel offline, PlaylistSyncContext context) {
    var key = support.normalizeName(offline.getName());
    var canonicalRemote = context
        .getRemoteActiveByName()
        .get(key);

    if (canonicalRemote == null || support.isDeleted(canonicalRemote)) {
      return;
    }

    // Merge tracks from the offline playlists into the canonical remote playlists.
    var changed = support.mergeTracksIntoCanonical(canonicalRemote, offline.getItems());

    var offlineTimestamp = offline.getLastEditTimestamp();
    var remoteTimestamp = canonicalRemote.getLastEditTimestamp();

    // Change the name on the server if the offline playlist is newer and has a valid name, and the names are not yet the same.
    if (support.compareInstants(offlineTimestamp, remoteTimestamp) > 0 && support.hasValidName(offline.getName()) &&
        !Objects.equals(canonicalRemote.getName(), offline.getName())) {
      var oldKey = support.normalizeName(canonicalRemote.getName());
      var newKey = support.normalizeName(offline.getName());

      if (Objects.equals(oldKey, newKey) &&
          support.canUseNameForCurrentPlaylist(offline.getName(), canonicalRemote.getId(), context)) {
        canonicalRemote.setName(offline.getName());
        changed = true;
      }
    }

    // Map the offline playlist ID to the canonical remote playlist ID, so that client can update local ID if needed.
    context.addIdMapping(offline.getId(), canonicalRemote.getId());

    if (changed) {
      support.saveAndRefresh(canonicalRemote);
    }
  }
}