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

  /*
   * Internal sync identity for playlist content.
   *
   * trackId alone is no longer enough because TMDB can reuse the same numeric ID
   * across different media types.
   */
  private record PlaylistContentKey(String trackId,
                                    MediaType mediaType) {

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
    playlist.setName(offline
                         .getName()
                         .trim());
    playlist.setUser(user);

    var items = extractContentKeys(offline.getItems())
        .stream()
        .map(key -> toPlaylistContentModel(key, playlist))
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

    if (hasValidName(newName) && !Objects.equals(remote.getName(), newName) &&
        canUseNameForCurrentPlaylist(newName, remote.getId(), context)) {

      /*
       * Keep the active-name lookup map in sync when the remote playlist name changes.
       */
      if (oldNameKey != null) {
        context
            .getRemoteActiveByName()
            .remove(oldNameKey);
      }

      remote.setName(newName.trim());
      context
          .getRemoteActiveByName()
          .put(normalizeName(newName), remote);
    }

    replaceTracks(remote, offline.getItems());
  }

  /*
   * Replace remote playlist contents using a diff instead of clear()+add().
   *
   * Why:
   * The DB has UNIQUE(playlist_id, track_id, media_type).
   * Calling clear() and then adding new entities can cause Hibernate to INSERT
   * before DELETE, which can temporarily violate the unique constraint.
   *
   * This method:
   * - removes only contents that are no longer desired
   * - adds only contents that are missing
   * - compares by trackId + mediaType
   */
  public void replaceTracks(PlaylistModel playlist, List<OfflinePlaylistContentModel> offlineItems) {
    var desiredKeys = extractContentKeys(offlineItems);
    var existingKeys = extractContentKeysFromRemote(playlist);

    playlist
        .getItems()
        .removeIf(item -> !desiredKeys.contains(toContentKey(item)));

    var keysToAdd = new HashSet<>(desiredKeys);
    keysToAdd.removeAll(existingKeys);

    for (var key : keysToAdd) {
      playlist
          .getItems()
          .add(toPlaylistContentModel(key, playlist));
    }
  }

  /*
   * Merge playlist contents into the canonical remote playlist.
   *
   * Used when the offline playlist has a different ID but the same active name.
   * Since the server playlist is canonical, we only add missing contents and do not remove
   * remote contents.
   */
  public boolean mergeTracksIntoCanonical(
      PlaylistModel canonicalRemote,
      List<OfflinePlaylistContentModel> offlineItems
  ) {
    var offlineKeys = extractContentKeys(offlineItems);

    if (offlineKeys.isEmpty()) {
      return false;
    }

    var remoteKeys = extractContentKeysFromRemote(canonicalRemote);

    var keysToAdd = new HashSet<>(offlineKeys);
    keysToAdd.removeAll(remoteKeys);

    if (keysToAdd.isEmpty()) {
      return false;
    }

    for (var key : keysToAdd) {
      canonicalRemote
          .getItems()
          .add(toPlaylistContentModel(key, canonicalRemote));
    }

    return true;
  }

  /*
   * Extract unique offline playlist content keys.
   *
   * This automatically removes duplicates from the client payload.
   */
  private Set<PlaylistContentKey> extractContentKeys(List<OfflinePlaylistContentModel> items) {
    if (items == null || items.isEmpty()) {
      return new HashSet<>();
    }

    return items
        .stream()
        .map(this::toContentKey)
        .filter(Objects::nonNull)
        .collect(Collectors.toCollection(HashSet::new));
  }

  /*
   * Extract unique remote playlist content keys.
   */
  private Set<PlaylistContentKey> extractContentKeysFromRemote(PlaylistModel playlist) {
    if (playlist == null || playlist.getItems() == null || playlist
        .getItems()
        .isEmpty()) {
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
    if (item == null || item.getTrackId() == null || item
        .getTrackId()
        .isBlank()) {
      return null;
    }

    return new PlaylistContentKey(
        item
            .getTrackId()
            .trim(), resolveMediaType(item.getMediaType())
    );
  }

  private PlaylistContentKey toContentKey(PlaylistContentModel item) {
    if (item == null || item.getTrackId() == null || item
        .getTrackId()
        .isBlank()) {
      return null;
    }

    return new PlaylistContentKey(
        item
            .getTrackId()
            .trim(), resolveMediaType(item.getMediaType())
    );
  }

  private MediaType resolveMediaType(MediaType mediaType) {
    /*
     * MOVIE fallback protects older local data and older DB rows.
     */
    return mediaType != null ? mediaType : MediaType.MOVIE;
  }

  private PlaylistContentModel toPlaylistContentModel(PlaylistContentKey key, PlaylistModel playlistModel) {
    return PlaylistContentModel
        .builder()
        .trackId(key.trackId())
        .mediaType(key.mediaType())
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