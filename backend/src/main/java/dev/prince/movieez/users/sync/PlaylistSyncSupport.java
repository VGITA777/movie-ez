package dev.prince.movieez.users.sync;

import dev.prince.movieez.security.models.PlaylistContentModel;
import dev.prince.movieez.security.models.PlaylistModel;
import dev.prince.movieez.security.models.UserModel;
import dev.prince.movieez.security.repositories.PlaylistRepository;
import dev.prince.movieez.users.models.models.OfflinePlaylistContentModel;
import dev.prince.movieez.users.models.models.OfflinePlaylistModel;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class PlaylistSyncSupport {

  private final PlaylistRepository playlistRepository;

  @PersistenceContext
  private EntityManager entityManager;

  public PlaylistSyncSupport(PlaylistRepository playlistRepository) {
    this.playlistRepository = playlistRepository;
  }

  public PlaylistModel createFromOffline(OfflinePlaylistModel offline, UserModel user) {
    if (offline == null) {
      throw new IllegalArgumentException("Offline playlist cannot be null");
    }

    if (!hasValidName(offline.getName())) {
      throw new IllegalArgumentException("Offline playlist name is required");
    }

    if (offline.getId() != null) {
      var existing = playlistRepository.findByIdAndUserId(offline.getId(), user.getId());

      if (existing.isPresent()) {
        return existing.get();
      }
    }

    var playlist = new PlaylistModel();
    playlist.setId(offline.getId() != null ? offline.getId() : UUID.randomUUID());
    playlist.setName(offline.getName());
    playlist.setUser(user);

    var items = new ArrayList<PlaylistContentModel>();
    var trackIds = extractTrackIds(offline.getItems());

    for (var trackId : trackIds) {
      items.add(toPlaylistContentModel(trackId, playlist));
    }

    playlist.setItems(items);

    var saved = saveAndRefresh(playlist);

    if (offline.getDeletedOn() != null) {
      saved.setDeletedOn(offline.getDeletedOn());
      saved = saveAndRefresh(saved);
    }

    return saved;
  }

  public PlaylistModel saveAndRefresh(PlaylistModel playlist) {
    var saved = playlistRepository.saveAndFlush(playlist);
    entityManager.refresh(saved);
    return saved;
  }

  public void replaceRemoteWithOffline(
      PlaylistModel remote,
      OfflinePlaylistModel offline,
      PlaylistSyncContext context
  ) {
    if (offline == null || remote == null) {
      return;
    }

    var oldNameKey = normalizeName(remote.getName());
    var newName = offline.getName();

    if (hasValidName(newName) && !Objects.equals(remote.getName(), newName) &&
        canUseNameForCurrentPlaylist(newName, remote.getId(), context)) {
      if (oldNameKey != null) {
        context
            .getRemoteActiveByName()
            .remove(oldNameKey);
      }

      remote.setName(newName);
      context
          .getRemoteActiveByName()
          .put(normalizeName(newName), remote);
    }

    replaceTracks(remote, offline.getItems());
  }

  public void replaceTracks(PlaylistModel playlist, List<OfflinePlaylistContentModel> offlineItems) {
    playlist
        .getItems()
        .clear();

    var trackIds = extractTrackIds(offlineItems);

    for (var trackId : trackIds) {
      playlist
          .getItems()
          .add(toPlaylistContentModel(trackId, playlist));
    }
  }

  public boolean mergeTracksIntoCanonical(
      PlaylistModel canonicalRemote,
      List<OfflinePlaylistContentModel> offlineItems
  ) {
    var offlineTrackIds = extractTrackIds(offlineItems);

    var remoteTrackIds = canonicalRemote
        .getItems()
        .stream()
        .map(PlaylistContentModel::getTrackId)
        .filter(trackId -> trackId != null && !trackId.isBlank())
        .collect(Collectors.toCollection(HashSet::new));

    var merged = new HashSet<>(remoteTrackIds);
    merged.addAll(offlineTrackIds);

    if (merged.equals(remoteTrackIds)) {
      return false;
    }

    var toAdd = new HashSet<>(merged);
    toAdd.removeAll(remoteTrackIds);

    for (var trackId : toAdd) {
      canonicalRemote
          .getItems()
          .add(toPlaylistContentModel(trackId, canonicalRemote));
    }

    return true;
  }

  public Set<String> extractTrackIds(List<OfflinePlaylistContentModel> items) {
    if (items == null || items.isEmpty()) {
      return new HashSet<>();
    }

    return items
        .stream()
        .map(OfflinePlaylistContentModel::getTrackId)
        .filter(trackId -> trackId != null && !trackId.isBlank())
        .collect(Collectors.toCollection(HashSet::new));
  }

  public PlaylistContentModel toPlaylistContentModel(String trackId, PlaylistModel playlistModel) {
    return PlaylistContentModel
        .builder()
        .trackId(trackId)
        .playlist(playlistModel)
        .build();
  }

  public boolean isDeleted(OfflinePlaylistModel playlist) {
    return playlist != null && playlist.getDeletedOn() != null;
  }

  public boolean isDeleted(PlaylistModel playlist) {
    return playlist != null && playlist.getDeletedOn() != null;
  }

  public String normalizeName(String name) {
    if (name == null) {
      return null;
    }

    var trimmed = name.trim();
    return trimmed.isEmpty() ? null : trimmed.toLowerCase();
  }

  public boolean hasValidName(String name) {
    return name != null && !name.isBlank();
  }

  public int compareInstants(Instant left, Instant right) {
    if (left == null && right == null) {
      return 0;
    }

    if (left == null) {
      return -1;
    }

    if (right == null) {
      return 1;
    }

    return left.compareTo(right);
  }

  public Instant maxInstant(Instant left, Instant right) {
    if (left == null) {
      return right;
    }

    if (right == null) {
      return left;
    }

    return left.isAfter(right) ? left : right;
  }

  public boolean canUseNameForCurrentPlaylist(String name, UUID currentPlaylistId, PlaylistSyncContext context) {
    var key = normalizeName(name);

    if (key == null) {
      return false;
    }

    var existing = context
        .getRemoteActiveByName()
        .get(key);

    return existing == null || Objects.equals(existing.getId(), currentPlaylistId);
  }

  public void removeActiveName(PlaylistModel playlist, PlaylistSyncContext context) {
    if (playlist == null || playlist.getName() == null) {
      return;
    }

    var key = normalizeName(playlist.getName());

    if (key != null) {
      context
          .getRemoteActiveByName()
          .remove(key);
    }
  }
}