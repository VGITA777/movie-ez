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
import dev.prince.movieez.users.sync.PlaylistSyncSupport;
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
  private final PlaylistSyncSupport support;
  private final List<PlaylistSyncStrategy> strategies;

  public PlaylistSyncService(
      PlaylistRepository playlistRepository,
      UserRepository userRepository,
      PlaylistSyncSupport support,
      List<PlaylistSyncStrategy> strategies
  ) {
    this.playlistRepository = playlistRepository;
    this.userRepository = userRepository;
    this.support = support;
    this.strategies = strategies;
  }

  @Transactional
  public PlaylistSyncResponse syncPlaylists(List<OfflinePlaylistModel> offlinePlaylists, UUID userId) {
    var safeOfflinePlaylists = offlinePlaylists != null ? offlinePlaylists : List.<OfflinePlaylistModel>of();

    var user = userRepository
        .findById(userId)
        .orElseThrow(() -> new UserNotFoundException("User with ID: '" + userId + "' not found"));

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
        .filter(playlist -> !support.isDeleted(playlist))
        .filter(playlist -> support.hasValidName(playlist.getName()))
        .collect(Collectors.toMap(
            playlist -> support.normalizeName(playlist.getName()),
            Function.identity(),
            (existing, ignored) -> existing,
            HashMap::new
        ));

    var context = new PlaylistSyncContext(remoteById, remoteActiveByName, user);

    for (var offline : safeOfflinePlaylists) {
      if (offline == null) {
        continue;
      }

      strategies
          .stream()
          .filter(syncStrategy -> syncStrategy.supports(offline, context))
          .findFirst()
          .ifPresent(strategy -> strategy.apply(offline, context));
    }

    var syncedPlaylists = playlistRepository
        .findAllByUserId(userId)
        .stream()
        .map(PlaylistMapper::toDto)
        .toList();

    return new PlaylistSyncResponse(syncedPlaylists, context.getIdMappings(), Instant.now());
  }
}