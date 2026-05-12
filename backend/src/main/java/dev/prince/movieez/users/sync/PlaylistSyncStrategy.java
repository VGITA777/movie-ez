package dev.prince.movieez.users.sync;

import dev.prince.movieez.users.models.models.OfflinePlaylistModel;

public interface PlaylistSyncStrategy {

  boolean supports(OfflinePlaylistModel offline, PlaylistSyncContext context);

  void apply(OfflinePlaylistModel offline, PlaylistSyncContext context);
}