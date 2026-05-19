package dev.prince.movieez.users.sync;

import dev.prince.movieez.media.models.enums.MediaType;
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
import java.util.LinkedHashMap;
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

  /**
   * Internal identity for playlist contents.
   *
   * addedOn is intentionally not part of the identity.
   * The database uniqueness should be:
   * UNIQUE (playlist_id, track_id, media_type)
   */
  private record PlaylistContentKey(
      String trackId,
      MediaType mediaType
  ) {
  }

  public PlaylistModel createFromOffline(OfflinePlaylistModel offline, UserModel user) {
    if (offline == null) {
      throw new IllegalArgumentException("Offline playlist cannot be null");
    }

    if (!hasValidName(offline.getName())) {
      throw new IllegalArgumentException("Offline playlist name is required");
    }

    if (offline.getCreatedOn() == null) {
      throw new IllegalArgumentException("Offline playlist createdOn is required");
    }

    if (offline.getId() != null) {
      var existing = playlistRepository.findByIdAndUserId(offline.getId(), user.getId());

      if (existing.isPresent()) {
        return existing.get();
      }
    }

    var playlist = new PlaylistModel();
    playlist.setId(offline.getId() != null ? offline.getId() : UUID.randomUUID());
    playlist.setName(offline.getName().trim());
    playlist.setCreatedOn(offline.getCreatedOn());
    playlist.setUser(user);

    var items = extractOfflineContentMap(offline.getItems())
        .values()
        .stream()
        .map(item -> toPlaylistContentModel(item, playlist))
        .collect(Collectors.toCollection(ArrayList::new));

    playlist.setItems(items);

    if (offline.getDeletedOn() != null) {
      playlist.setDeletedOn(offline.getDeletedOn());
    }

    return saveAndRefresh(playlist);
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

    if (hasValidName(newName)
        && !Objects.equals(remote.getName(), newName)
        && canUseNameForCurrentPlaylist(newName, remote.getId(), context)) {

      if (oldNameKey != null) {
        context.getRemoteActiveByName().remove(oldNameKey);
      }

      remote.setName(newName.trim());
      context.getRemoteActiveByName().put(normalizeName(newName), remote);
    }

    replaceTracks(remote, offline.getItems());
  }

  /**
   * Replace remote playlist contents using a diff instead of clear()+add().
   *
   * This avoids temporary UNIQUE(playlist_id, track_id, media_type)
   * violations where Hibernate may insert before deleting old rows.
   */
  public void replaceTracks(
      PlaylistModel playlist,
      List<OfflinePlaylistContentModel> offlineItems
  ) {
    var desiredContent = extractOfflineContentMap(offlineItems);
    var desiredKeys = desiredContent.keySet();
    var existingKeys = extractContentKeysFromRemote(playlist);

    playlist.getItems().removeIf(item -> !desiredKeys.contains(toContentKey(item)));

    var keysToAdd = new HashSet<>(desiredKeys);
    keysToAdd.removeAll(existingKeys);

    for (var key : keysToAdd) {
      var offlineContent = desiredContent.get(key);

      playlist.getItems().add(toPlaylistContentModel(offlineContent, playlist));
    }
  }

  /**
   * Merge offline contents into the canonical remote playlist.
   *
   * Used when the offline playlist has a different ID but the same active name.
   * The server playlist is canonical, so this only adds missing contents.
   */
  public boolean mergeTracksIntoCanonical(
      PlaylistModel canonicalRemote,
      List<OfflinePlaylistContentModel> offlineItems
  ) {
    var offlineContent = extractOfflineContentMap(offlineItems);

    if (offlineContent.isEmpty()) {
      return false;
    }

    var remoteKeys = extractContentKeysFromRemote(canonicalRemote);

    var keysToAdd = new HashSet<>(offlineContent.keySet());
    keysToAdd.removeAll(remoteKeys);

    if (keysToAdd.isEmpty()) {
      return false;
    }

    for (var key : keysToAdd) {
      canonicalRemote
          .getItems()
          .add(toPlaylistContentModel(offlineContent.get(key), canonicalRemote));
    }

    return true;
  }

  /**
   * Extract unique offline playlist contents.
   *
   * Dedupe rule:
   * - identity is trackId + mediaType
   * - if duplicates exist, keep the earliest addedOn
   */
  private LinkedHashMap<PlaylistContentKey, OfflinePlaylistContentModel> extractOfflineContentMap(
      List<OfflinePlaylistContentModel> items
  ) {
    var result = new LinkedHashMap<PlaylistContentKey, OfflinePlaylistContentModel>();

    if (items == null || items.isEmpty()) {
      return result;
    }

    for (var item : items) {
      if (!isValidOfflineContent(item)) {
        continue;
      }

      var key = toContentKey(item);
      var existing = result.get(key);

      if (existing == null || item.getAddedOn().isBefore(existing.getAddedOn())) {
        result.put(key, normalizedOfflineContent(item));
      }
    }

    return result;
  }

  private Set<PlaylistContentKey> extractContentKeysFromRemote(PlaylistModel playlist) {
    if (playlist == null || playlist.getItems() == null || playlist.getItems().isEmpty()) {
      return new HashSet<>();
    }

    return playlist
        .getItems()
        .stream()
        .map(this::toContentKey)
        .filter(Objects::nonNull)
        .collect(Collectors.toCollection(HashSet::new));
  }

  private PlaylistContentKey toContentKey(OfflinePlaylistContentModel item) {
    if (item == null || item.getTrackId() == null || item.getTrackId().isBlank()) {
      return null;
    }

    if (item.getMediaType() == null) {
      throw new IllegalArgumentException("Playlist content mediaType is required");
    }

    return new PlaylistContentKey(
        item.getTrackId().trim(),
        item.getMediaType()
    );
  }

  private PlaylistContentKey toContentKey(PlaylistContentModel item) {
    if (item == null || item.getTrackId() == null || item.getTrackId().isBlank()) {
      return null;
    }

    if (item.getMediaType() == null) {
      return null;
    }

    return new PlaylistContentKey(
        item.getTrackId().trim(),
        item.getMediaType()
    );
  }

  private OfflinePlaylistContentModel normalizedOfflineContent(OfflinePlaylistContentModel item) {
    return OfflinePlaylistContentModel
        .builder()
        .trackId(item.getTrackId().trim())
        .mediaType(item.getMediaType())
        .addedOn(item.getAddedOn())
        .build();
  }

  private boolean isValidOfflineContent(OfflinePlaylistContentModel item) {
    if (item == null) {
      return false;
    }

    if (item.getTrackId() == null || item.getTrackId().isBlank()) {
      return false;
    }

    if (item.getMediaType() == null) {
      throw new IllegalArgumentException("Playlist content mediaType is required");
    }

    if (item.getAddedOn() == null) {
      throw new IllegalArgumentException("Playlist content addedOn is required");
    }

    return true;
  }

  private PlaylistContentModel toPlaylistContentModel(
      OfflinePlaylistContentModel item,
      PlaylistModel playlistModel
  ) {
    return PlaylistContentModel
        .builder()
        .trackId(item.getTrackId().trim())
        .mediaType(item.getMediaType())
        .addedOn(item.getAddedOn())
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

  public boolean canUseNameForCurrentPlaylist(
      String name,
      UUID currentPlaylistId,
      PlaylistSyncContext context
  ) {
    var key = normalizeName(name);

    if (key == null) {
      return false;
    }

    var existing = context.getRemoteActiveByName().get(key);

    return existing == null || Objects.equals(existing.getId(), currentPlaylistId);
  }

  public void removeActiveName(PlaylistModel playlist, PlaylistSyncContext context) {
    if (playlist == null || playlist.getName() == null) {
      return;
    }

    var key = normalizeName(playlist.getName());

    if (key != null) {
      context.getRemoteActiveByName().remove(key);
    }
  }
}