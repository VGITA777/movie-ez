package dev.prince.movieez.users.services;

import dev.prince.movieez.security.dto.PlaylistDto;
import dev.prince.movieez.security.repositories.PlaylistRepository;
import dev.prince.movieez.users.models.models.OfflinePlaylistModel;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class PlaylistSyncService {

  private final PlaylistService playlistService;
  private final PlaylistRepository playlistRepository;

  public PlaylistSyncService(PlaylistService playlistService, PlaylistRepository playlistRepository) {
    this.playlistService = playlistService;
    this.playlistRepository = playlistRepository;
  }


  public List<PlaylistDto> mergePlaylists(List<OfflinePlaylistModel> offlinePlaylists, UUID userId) {
    var remotePlaylists = playlistRepository.findAllByUserId(userId);

    /*
     * Merge Rules:
     * 1. All playlists from the offline client that do not exist on the server should be created on the server.
     *
     * 2. If a playlist exists both on the client and server, these rules will be applied:
     *   a. If the client and server have the same id, treat them as the same playlist and sync by lastEditTimestamp.
     *   b. If the playlists have different ids but the same active name:
     *      - do not create a second active playlist with the same name
     *      - treat the server playlist as the canonical active playlist
     *      - merge the client tracks into the server playlist
     *      - replace the client playlist id with the server playlist id
     *      - keep the newer lastEditTimestamp / name value when both differ
     *   c. If the playlist has been deleted on the server but exists on the client, it should be deleted on the client.
     *   d. If the playlist has been deleted on the client but exists on the server, it should be deleted on the server.
     *   e. If both the client and server playlist are deleted, keep the newest deletion timestamp and keep the tombstone on both sides.
     *   f. If both playlists are active and have the same id:
     *      - compare lastEditTimestamp
     *      - if the client version is newer, update the server with the client version
     *      - if the server version is newer, update the client with the server version
     *   g. If both active playlists with the same id have different track lists, merge trackIds by union:
     *      - keep only unique trackIds
     *      - since trackIds are unique within a playlist, duplicates must be ignored
     *
     * 3. All playlists from the server that do not exist on the client should be created on the client.
     *
     * 4. Deleted playlists must be treated as tombstones, not removed immediately, so deletion can sync properly across devices.
     *
     * 5. Playlist identity is always determined by id, never by name.
     *
     * 6. If two playlists share the same name but have different ids, treat them as different playlists only until sync detects the conflict; during sync, the active server playlist becomes canonical.
     */

    return List.of();
  }
}
