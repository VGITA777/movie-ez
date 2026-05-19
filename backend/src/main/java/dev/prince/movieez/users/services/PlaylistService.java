package dev.prince.movieez.users.services;

import dev.prince.movieez.exceptions.PlaylistAlreadyExistsException;
import dev.prince.movieez.exceptions.PlaylistContentAlreadyExistsException;
import dev.prince.movieez.exceptions.PlaylistNotFoundException;
import dev.prince.movieez.exceptions.UserNotFoundException;
import dev.prince.movieez.media.models.enums.MediaType;
import dev.prince.movieez.security.models.PlaylistContentModel;
import dev.prince.movieez.security.models.PlaylistModel;
import dev.prince.movieez.security.models.UserModel;
import dev.prince.movieez.security.repositories.PlaylistContentRepository;
import dev.prince.movieez.security.repositories.PlaylistRepository;
import dev.prince.movieez.security.repositories.UserRepository;
import dev.prince.movieez.users.models.inputs.CreatePlaylistInput;
import dev.prince.movieez.users.models.inputs.PlaylistInput;
import dev.prince.movieez.users.models.inputs.PlaylistTrackIdentityInput;
import dev.prince.movieez.users.models.inputs.PlaylistTrackInfoInput;
import dev.prince.movieez.users.models.inputs.PlaylistUpdateInput;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class PlaylistService {

  private final UserRepository userRepository;
  private final PlaylistRepository playlistRepository;
  private final PlaylistContentRepository playlistContentRepository;

  @PersistenceContext
  private EntityManager entityManager;

  public PlaylistService(
      UserRepository userRepository,
      PlaylistRepository playlistRepository,
      PlaylistContentRepository playlistContentRepository
  ) {
    this.userRepository = userRepository;
    this.playlistRepository = playlistRepository;
    this.playlistContentRepository = playlistContentRepository;
  }

  /*
   * Composite identity for playlist contents.
   *
   * trackId alone is not enough because TMDB can reuse the same ID
   * across movie, tv, and person records.
   */
  private record TrackKey(
      String trackId,
      MediaType mediaType
  ) {
  }

  @Transactional
  public PlaylistModel createPlaylist(CreatePlaylistInput input, UUID userId) {
    if (input.playlistId() != null) {
      var existingPlaylist = findNotDeleted(input.playlistId(), userId);

      if (existingPlaylist.isPresent()) {
        return existingPlaylist.get();
      }
    }

    var existingPlaylist = findNotDeleted(input.name(), userId);

    if (existingPlaylist.isPresent()) {
      return existingPlaylist.get();
    }

    var user = getUser(userId);

    var playlistModel = new PlaylistModel();
    playlistModel.setName(input.name().trim());
    playlistModel.setCreatedOn(input.createdOn());
    playlistModel.setUser(user);
    setId(playlistModel, input.playlistId());

    playlistModel.setItems(toPlaylistContentModels(input.tracks(), playlistModel));

    return savePlaylistAndGetResult(playlistModel);
  }

  @Transactional
  public Collection<PlaylistModel> createPlaylists(List<PlaylistInput> playlists, UUID userId) {
    var safePlaylists = playlists != null ? playlists : List.<PlaylistInput>of();
    var user = getUser(userId);

    var activePlaylists = playlistRepository.findAllByUserIdAndDeletedOnIsNull(userId);

    var existingIds = activePlaylists
        .stream()
        .map(PlaylistModel::getId)
        .collect(Collectors.toSet());

    var existingNames = activePlaylists
        .stream()
        .map(playlist -> normalizeName(playlist.getName()))
        .collect(Collectors.toSet());

    var playlistsToCreate = safePlaylists
        .stream()
        .filter(Objects::nonNull)
        .filter(input -> !existingIds.contains(input.id()))
        .filter(input -> !existingNames.contains(normalizeName(input.name())))
        .map(input -> toPlaylistModel(input, user))
        .collect(Collectors.toCollection(ArrayList::new));

    playlistRepository.saveAllAndFlush(playlistsToCreate);

    return findAllByUserIdAndNotDeleted(userId);
  }

  @Transactional
  public PlaylistModel updatePlaylistName(UUID id, String newName, UUID userId) {
    var playlist = getPlaylist(id, userId);
    applyPlaylistNameUpdate(playlist, newName, userId);
    return savePlaylistAndGetResult(playlist);
  }

  @Transactional
  public PlaylistModel addToPlaylist(
      UUID id,
      PlaylistTrackInfoInput input,
      UUID userId
  ) {
    var playlist = getPlaylist(id, userId);
    var normalizedTrackId = normalizeTrackId(input.trackId());

    boolean alreadyExists = playlistContentRepository.existsByPlaylistIdAndTrackIdAndMediaType(
        playlist.getId(),
        normalizedTrackId,
        input.mediaType()
    );

    if (alreadyExists) {
      throw new PlaylistContentAlreadyExistsException(
          "Track with ID: '" + normalizedTrackId + "' and media type: '" + input.mediaType()
              + "' already exists in this playlist"
      );
    }

    playlist
        .getItems()
        .add(toPlaylistContentModel(input, playlist));

    return savePlaylistAndGetResult(playlist);
  }

  @Transactional
  public PlaylistModel addToPlaylist(
      UUID id,
      Collection<PlaylistTrackInfoInput> tracks,
      UUID userId
  ) {
    var playlist = getPlaylist(id, userId);
    addTracks(playlist, tracks);
    return savePlaylistAndGetResult(playlist);
  }

  @Transactional
  public void delete(UUID id, UUID userId) {
    var playlist = playlistRepository
        .findByIdAndUserIdAndDeletedOnIsNull(id, userId)
        .orElseThrow(() -> new PlaylistNotFoundException("Playlist not found"));

    playlist.setDeletedOn(java.time.Instant.now());
    playlistRepository.saveAndFlush(playlist);
  }

  @Transactional
  public PlaylistModel deleteTrackFromPlaylist(
      UUID id,
      PlaylistTrackIdentityInput input,
      UUID userId
  ) {
    var playlist = getPlaylist(id, userId);
    removeTracks(playlist, Set.of(input));
    return savePlaylistAndGetResult(playlist);
  }

  @Transactional
  public PlaylistModel deleteAllTracksFromPlaylist(
      UUID id,
      Collection<PlaylistTrackIdentityInput> tracks,
      UUID userId
  ) {
    var playlist = getPlaylist(id, userId);
    removeTracks(playlist, tracks);
    return savePlaylistAndGetResult(playlist);
  }

  @Transactional
  public PlaylistModel deleteAllTracksFromPlaylist(UUID id, UUID userId) {
    var playlist = getPlaylist(id, userId);
    playlist.getItems().clear();
    return savePlaylistAndGetResult(playlist);
  }

  @Transactional
  public PlaylistModel updatePlaylist(UUID id, PlaylistUpdateInput input, UUID userId) {
    var playlist = getPlaylist(id, userId);

    var oldName = playlist.getName();
    var newName = input.newName();

    if (newName != null && !newName.isBlank() && !normalizeName(newName).equals(normalizeName(oldName))) {
      applyPlaylistNameUpdate(playlist, newName, userId);
    } else if (newName != null && !newName.isBlank() && !newName.equals(oldName)) {
      /*
       * Allows case/format-only changes like:
       * "favorites" -> "Favorites"
       */
      playlist.setName(newName.trim());
    }

    /*
     * Full replacement takes precedence over incremental add/remove.
     */
    if (input.newTracks() != null) {
      overrideTracks(playlist, input.newTracks());
      return savePlaylistAndGetResult(playlist);
    }

    if (input.tracksToRemove() != null) {
      removeTracks(playlist, input.tracksToRemove());
    }

    if (input.tracksToAdd() != null) {
      addTracks(playlist, input.tracksToAdd());
    }

    return savePlaylistAndGetResult(playlist);
  }

  public Optional<PlaylistModel> findNotDeleted(UUID id, UUID userId) {
    return playlistRepository.findByIdAndUserIdAndDeletedOnIsNull(id, userId);
  }

  public Optional<PlaylistModel> findNotDeleted(String name, UUID userId) {
    return playlistRepository.findByNameIgnoreCaseAndUserIdAndDeletedOnIsNull(name, userId);
  }

  public List<PlaylistModel> findAllByUserIdAndNotDeleted(UUID userId) {
    return playlistRepository.findAllByUserIdAndDeletedOnIsNull(userId);
  }

  private PlaylistModel toPlaylistModel(PlaylistInput input, UserModel user) {
    var playlistModel = new PlaylistModel();
    playlistModel.setName(input.name().trim());
    playlistModel.setCreatedOn(input.createdOn());
    playlistModel.setUser(user);
    setId(playlistModel, input.id());

    playlistModel.setItems(toPlaylistContentModels(input.tracks(), playlistModel));

    return playlistModel;
  }

  private List<PlaylistContentModel> toPlaylistContentModels(
      Collection<PlaylistTrackInfoInput> tracks,
      PlaylistModel playlist
  ) {
    var uniqueTracks = dedupeTrackInputs(tracks);

    return uniqueTracks
        .values()
        .stream()
        .map(track -> toPlaylistContentModel(track, playlist))
        .collect(Collectors.toCollection(ArrayList::new));
  }

  private void addTracks(
      PlaylistModel playlist,
      Collection<PlaylistTrackInfoInput> tracks
  ) {
    var existingKeys = playlist
        .getItems()
        .stream()
        .map(this::toTrackKey)
        .collect(Collectors.toCollection(HashSet::new));

    var uniqueTracks = dedupeTrackInputs(tracks);

    var tracksToAdd = uniqueTracks
        .entrySet()
        .stream()
        .filter(entry -> !existingKeys.contains(entry.getKey()))
        .map(entry -> toPlaylistContentModel(entry.getValue(), playlist))
        .collect(Collectors.toCollection(ArrayList::new));

    playlist.getItems().addAll(tracksToAdd);
  }

  private void removeTracks(
      PlaylistModel playlist,
      Collection<PlaylistTrackIdentityInput> tracks
  ) {
    var keysToRemove = tracks == null
        ? Set.<TrackKey>of()
        : tracks
            .stream()
            .filter(this::isValidTrackIdentityInput)
            .map(this::toTrackKey)
            .collect(Collectors.toCollection(HashSet::new));

    if (keysToRemove.isEmpty()) {
      return;
    }

    playlist
        .getItems()
        .removeIf(item -> keysToRemove.contains(toTrackKey(item)));
  }

  /*
   * Replace tracks using a diff instead of clear()+add().
   *
   * This avoids temporary UNIQUE(playlist_id, track_id, media_type)
   * violations where Hibernate may insert before deleting old rows.
   */
  private void overrideTracks(
      PlaylistModel playlist,
      Collection<PlaylistTrackInfoInput> tracks
  ) {
    var desiredTracks = dedupeTrackInputs(tracks);
    var desiredKeys = desiredTracks.keySet();

    var existingKeys = playlist
        .getItems()
        .stream()
        .map(this::toTrackKey)
        .collect(Collectors.toCollection(HashSet::new));

    playlist
        .getItems()
        .removeIf(item -> !desiredKeys.contains(toTrackKey(item)));

    var keysToAdd = new HashSet<>(desiredKeys);
    keysToAdd.removeAll(existingKeys);

    for (var key : keysToAdd) {
      var input = desiredTracks.get(key);
      playlist
          .getItems()
          .add(toPlaylistContentModel(input, playlist));
    }
  }

  private void applyPlaylistNameUpdate(PlaylistModel playlist, String newName, UUID userId) {
    var trimmedName = newName.trim();

    if (!normalizeName(trimmedName).equals(normalizeName(playlist.getName()))
        && isPlaylistExisting(trimmedName, userId)) {
      var msg = "Playlist with name: '" + trimmedName + "' already exists";
      throw new PlaylistAlreadyExistsException(msg);
    }

    playlist.setName(trimmedName);
  }

  private PlaylistModel getPlaylist(UUID id, UUID userId) {
    return playlistRepository
        .findByIdAndUserIdAndDeletedOnIsNull(id, userId)
        .orElseThrow(() -> {
          var msg = "Playlist with ID '" + id + "' not found";
          return new PlaylistNotFoundException(msg);
        });
  }

  private UserModel getUser(UUID userId) {
    return userRepository
        .findById(userId)
        .orElseThrow(() -> new UserNotFoundException("User with ID: '" + userId + "' not found"));
  }

  private PlaylistContentModel toPlaylistContentModel(
      PlaylistTrackInfoInput input,
      PlaylistModel playlistModel
  ) {
    return PlaylistContentModel
        .builder()
        .trackId(normalizeTrackId(input.trackId()))
        .mediaType(input.mediaType())
        .addedOn(input.addedOn())
        .playlist(playlistModel)
        .build();
  }

  private TrackKey toTrackKey(PlaylistTrackInfoInput input) {
    return new TrackKey(
        normalizeTrackId(input.trackId()),
        input.mediaType()
    );
  }

  private TrackKey toTrackKey(PlaylistTrackIdentityInput input) {
    return new TrackKey(
        normalizeTrackId(input.trackId()),
        input.mediaType()
    );
  }

  private TrackKey toTrackKey(PlaylistContentModel content) {
    return new TrackKey(
        normalizeTrackId(content.getTrackId()),
        content.getMediaType()
    );
  }

  private LinkedHashMap<TrackKey, PlaylistTrackInfoInput> dedupeTrackInputs(
      Collection<PlaylistTrackInfoInput> tracks
  ) {
    var result = new LinkedHashMap<TrackKey, PlaylistTrackInfoInput>();

    if (tracks == null) {
      return result;
    }

    for (var track : tracks) {
      if (!isValidTrackInfoInput(track)) {
        continue;
      }

      result.putIfAbsent(toTrackKey(track), track);
    }

    return result;
  }

  private boolean isValidTrackInfoInput(PlaylistTrackInfoInput input) {
    return input != null
        && input.trackId() != null
        && !input.trackId().isBlank()
        && input.mediaType() != null
        && input.addedOn() != null;
  }

  private boolean isValidTrackIdentityInput(PlaylistTrackIdentityInput input) {
    return input != null
        && input.trackId() != null
        && !input.trackId().isBlank()
        && input.mediaType() != null;
  }

  private boolean isPlaylistExisting(String name, UUID userId) {
    return playlistRepository.existsByNameIgnoreCaseAndUserIdAndDeletedOnIsNull(name, userId);
  }

  private void setId(PlaylistModel playlistModel, UUID id) {
    playlistModel.setId(id != null ? id : UUID.randomUUID());
  }

  private String normalizeTrackId(String trackId) {
    return trackId.trim();
  }

  private String normalizeName(String name) {
    return name == null ? "" : name.trim().toLowerCase();
  }

  private PlaylistModel savePlaylistAndGetResult(PlaylistModel playlist) {
    var saved = playlistRepository.saveAndFlush(playlist);
    entityManager.refresh(saved);
    return saved;
  }
}