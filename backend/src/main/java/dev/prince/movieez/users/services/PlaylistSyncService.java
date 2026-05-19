package dev.prince.movieez.users.services;

import dev.prince.movieez.exceptions.UserNotFoundException;
import dev.prince.movieez.security.dto.PlaylistMapper;
import dev.prince.movieez.security.models.PlaylistModel;
import dev.prince.movieez.security.repositories.PlaylistRepository;
import dev.prince.movieez.security.repositories.UserRepository;
import dev.prince.movieez.users.models.models.OfflinePlaylistModel;
import dev.prince.movieez.users.models.responses.PlaylistSyncResponse;
import dev.prince.movieez.users.sync.PlaylistSyncContext;
import dev.prince.movieez.users.sync.PlaylistSyncStrategy;
import jakarta.transaction.Transactional;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class PlaylistSyncService {

  private final PlaylistRepository playlistRepository;
  private final UserRepository userRepository;
  private final List<PlaylistSyncStrategy> strategies;

  public PlaylistSyncService(
      PlaylistRepository playlistRepository,
      UserRepository userRepository,
      List<PlaylistSyncStrategy> strategies
  ) {
    this.playlistRepository = playlistRepository;
    this.userRepository = userRepository;
    this.strategies = strategies;
  }

  /**
   * Syncs offline client playlists into the server, then returns the canonical server playlist state.
   * <p>
   * Important sync identities: - Playlist identity: playlist id - Active-name conflict identity: normalized playlist
   * name - Playlist content identity: trackId + mediaType
   */
  @Transactional
  public PlaylistSyncResponse syncPlaylists(List<OfflinePlaylistModel> offlinePlaylists, UUID userId) {
    var safeOfflinePlaylists = offlinePlaylists != null ? offlinePlaylists : List.<OfflinePlaylistModel>of();

    var user = userRepository
        .findById(userId)
        .orElseThrow(() -> new UserNotFoundException("User with ID: '" + userId + "' not found"));

    /*
     * Include deleted playlists here because tombstones are required for sync.
     */
    var remotePlaylists = playlistRepository.findAllByUserId(userId);

    var remoteById = remotePlaylists
        .stream()
        .collect(Collectors.toMap(
            PlaylistModel::getId,
            Function.identity(),
            (existing, ignored) -> existing,
            HashMap::new
        ));

    var remoteActiveByName = remotePlaylists
        .stream()
        .filter(playlist -> playlist.getDeletedOn() == null)
        .filter(playlist -> playlist.getName() != null && !playlist
            .getName()
            .isBlank())
        .collect(Collectors.toMap(
            playlist -> playlist
                .getName()
                .trim()
                .toLowerCase(), Function.identity(), (existing, ignored) -> existing, HashMap::new
        ));

    var context = new PlaylistSyncContext(remoteById, remoteActiveByName, user);

    for (var offline : safeOfflinePlaylists) {
      if (offline == null) {
        continue;
      }

      strategies
          .stream()
          .filter(strategy -> strategy.supports(offline, context))
          .findFirst()
          .ifPresent(strategy -> strategy.apply(offline, context));
    }

    /*
     * Return all server playlists, including tombstones.
     * The client needs tombstones to delete/hide local playlists correctly.
     */
    var syncedPlaylists = playlistRepository.findAllByUserId(userId);

    return new PlaylistSyncResponse(PlaylistMapper.toDtoList(syncedPlaylists), context.getIdMappings(), Instant.now());
  }
}