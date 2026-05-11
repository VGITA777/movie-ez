package dev.prince.movieez.users.services;

import dev.prince.movieez.exceptions.PlaylistAlreadyExistsException;
import dev.prince.movieez.exceptions.PlaylistContentAlreadyExistsException;
import dev.prince.movieez.exceptions.PlaylistNotFoundException;
import dev.prince.movieez.exceptions.UserNotFoundException;
import dev.prince.movieez.security.models.PlaylistContentModel;
import dev.prince.movieez.security.models.PlaylistModel;
import dev.prince.movieez.security.models.UserModel;
import dev.prince.movieez.security.repositories.PlaylistContentRepository;
import dev.prince.movieez.security.repositories.PlaylistRepository;
import dev.prince.movieez.security.repositories.UserRepository;
import dev.prince.movieez.users.models.inputs.PlaylistInput;
import dev.prince.movieez.users.models.inputs.PlaylistUpdateInput;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
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

  @Transactional
  public PlaylistModel updatePlaylistName(UUID id, String newName, UUID userId) {
    var playlist = getPlaylist(id, userId);
    if (isPlaylistExisting(newName, userId)) {
      var msg = "Playlist with name: '" + newName + "' already exists";
      throw new PlaylistAlreadyExistsException(msg);
    }
    playlist.setName(newName);
    return savePlaylistAndGetResult(playlist);
  }

  @Transactional
  public PlaylistModel createPlaylist(String name, Collection<String> trackIds, UUID playlistId, UUID userId) {
    if (playlistId != null) {
      var existingPlaylist = find(playlistId, userId);

      if (existingPlaylist.isPresent()) {
        return existingPlaylist.get();
      }
    }

    var existingPlaylist = find(name, userId);

    if (existingPlaylist.isPresent()) {
      return existingPlaylist.get();
    }

    var playlistModel = new PlaylistModel();
    playlistModel.setName(name);
    setId(playlistModel, playlistId);

    var tracks = trackIds
        .stream()
        .filter(trackId -> !trackId.isBlank())
        .map(trackId -> toPlaylistContentModel(trackId, playlistModel))
        .collect(Collectors.toCollection(java.util.ArrayList::new));

    playlistModel.setItems(tracks);
    return savePlaylistAndGetResult(playlistModel);
  }

  public Optional<PlaylistModel> find(UUID id, UUID userId) {
    return playlistRepository.findByIdAndUserId(id, userId);
  }

  public Optional<PlaylistModel> find(String name, UUID userId) {
    return playlistRepository.findByNameAndUserId(name, userId);
  }

  public List<PlaylistModel> findAllByUserId(UUID uuid) {
    return playlistRepository.findAllByUserId(uuid);
  }

  @Transactional
  public PlaylistModel addToPlaylist(UUID id, String trackId, UUID userId) {
    var playlist = getPlaylist(id, userId);

    boolean alreadyExists = playlistContentRepository.existsByPlaylistIdAndTrackId(playlist.getId(), trackId);
    if (alreadyExists) {
      throw new PlaylistContentAlreadyExistsException(
          "Track with ID: '" + trackId + "' already exists in this playlist");
    }

    var track = toPlaylistContentModel(trackId, playlist);
    playlist
        .getItems()
        .add(track);
    return savePlaylistAndGetResult(playlist);
  }

  @Transactional
  public PlaylistModel addToPlaylist(UUID id, Collection<String> trackIds, UUID userId) {
    var playlist = getPlaylist(id, userId);
    var existingTracks = playlist
        .getItems()
        .stream()
        .map(PlaylistContentModel::getTrackId)
        .filter(trackId -> !trackId.isBlank())
        .collect(Collectors.toSet());
    var tracksToAdd = new HashSet<>(trackIds);
    tracksToAdd.removeAll(existingTracks);

    var trackModels = tracksToAdd
        .stream()
        .map(track -> toPlaylistContentModel(track, playlist))
        .collect(Collectors.toCollection(java.util.ArrayList::new));
    playlist
        .getItems()
        .addAll(trackModels);

    return savePlaylistAndGetResult(playlist);
  }

  @Transactional
  public void delete(UUID id, UUID userId) {
    var existing = playlistRepository.findByIdAndUserId(id, userId);
    if (existing.isEmpty()) {
      throw new PlaylistNotFoundException("Playlist not found");
    }

    playlistRepository.deleteByIdAndUserId(id, userId);
  }

  @Transactional
  public PlaylistModel deleteTrackFromPlaylist(UUID id, String trackId, UUID userId) {
    var playlist = getPlaylist(id, userId);
    playlist
        .getItems()
        .removeIf(item -> item
            .getTrackId()
            .equals(trackId));
    return savePlaylistAndGetResult(playlist);
  }

  @Transactional
  public PlaylistModel deleteAllTracksFromPlaylist(UUID id, Collection<String> trackIds, UUID userId) {
    var playlist = getPlaylist(id, userId);
    playlist
        .getItems()
        .removeIf(item -> trackIds.contains(item.getTrackId()));
    return savePlaylistAndGetResult(playlist);
  }

  @Transactional
  public PlaylistModel deleteAllTracksFromPlaylist(UUID id, UUID userId) {
    var playlist = getPlaylist(id, userId);
    playlist
        .getItems()
        .clear();
    return savePlaylistAndGetResult(playlist);
  }

  @Transactional
  public PlaylistModel updatePlaylist(UUID id, PlaylistUpdateInput input, UUID userId) {
    var playlist = getPlaylist(id, userId);
    var oldName = playlist.getName();
    var newName = input.newName();
    var newTracks = input.newTracks();
    var tracksToRemove = input.tracksToRemove();
    var tracksToAdd = input.tracksToAdd();

    if (newName != null && !newName.isBlank() && !newName.equals(oldName)) {
      applyPlaylistNameUpdate(playlist, newName, userId);
    }

    // If newTracks is provided, it takes precedence over tracksToAdd and tracksToRemove
    if (newTracks != null) {
      overrideTracks(playlist, newTracks);
      return savePlaylistAndGetResult(playlist);
    }

    if (tracksToRemove != null) {
      removeTracks(playlist, tracksToRemove);
    }

    if (tracksToAdd != null) {
      addTracks(playlist, tracksToAdd);
    }

    return savePlaylistAndGetResult(playlist);
  }

  @Transactional
  public Collection<PlaylistModel> createPlaylists(List<PlaylistInput> playlists, UUID userId) {
    var user = userRepository
        .findById(userId)
        .orElseThrow(() -> new UserNotFoundException("User with ID: '" + userId + "' not found"));
    var userPlaylists = user.getPlaylistModels();
    var existingPlaylistNames = userPlaylists
        .stream()
        .map(PlaylistModel::getName)
        .collect(Collectors.toSet());
    // Skip all playlists that already exist and create only the new ones
    var playlistsToCreate = playlists
        .stream()
        .filter(playlist -> !existingPlaylistNames.contains(playlist.name()))
        .map(playlist -> toPlaylistModel(playlist, user))
        .collect(Collectors.toCollection(ArrayList::new));

    userPlaylists.addAll(playlistsToCreate);
    userRepository.saveAndFlush(user);
    return findAllByUserId(userId);
  }

  private PlaylistModel toPlaylistModel(PlaylistInput input, UserModel user) {
    var playlistModel = new PlaylistModel();
    playlistModel.setName(input.name());
    setId(playlistModel, input.id());
    playlistModel.setUser(user);
    var trackModels = toPlaylistContentModels(input.trackIds(), playlistModel);
    playlistModel.setItems(trackModels);
    return playlistModel;
  }

  private List<PlaylistContentModel> toPlaylistContentModels(Collection<String> trackIds, PlaylistModel playlist) {
    return trackIds
        .stream()
        .filter(trackId -> !trackId.isBlank())
        .map(trackId -> toPlaylistContentModel(trackId, playlist))
        .collect(Collectors.toCollection(ArrayList::new));
  }

  private void removeTracks(PlaylistModel playlist, Collection<String> trackIds) {
    playlist
        .getItems()
        .removeIf(item -> trackIds.contains(item.getTrackId()));
  }

  private void addTracks(PlaylistModel playlist, Collection<String> trackIds) {
    var existingTrackIds = playlist
        .getItems()
        .stream()
        .map(PlaylistContentModel::getTrackId)
        .collect(Collectors.toSet());
    var newTracksToAdd = trackIds
        .stream()
        .filter(trackId -> !trackId.isBlank())
        .filter(trackId -> !existingTrackIds.contains(trackId))
        .map(trackId -> toPlaylistContentModel(trackId, playlist))
        .collect(Collectors.toSet());
    playlist
        .getItems()
        .addAll(newTracksToAdd);
  }

  private void overrideTracks(PlaylistModel playlist, Collection<String> trackIds) {
    var existingTrackIds = playlist
        .getItems()
        .stream()
        .map(PlaylistContentModel::getTrackId)
        .collect(Collectors.toSet());
    var tracksToAdd = trackIds
        .stream()
        .filter(trackId -> !trackId.isBlank())
        .filter(trackId -> !existingTrackIds.contains(trackId))
        .map(trackId -> toPlaylistContentModel(trackId, playlist))
        .collect(Collectors.toCollection(HashSet::new));
    playlist
        .getItems()
        .removeIf(item -> {
          var trackId = item.getTrackId();
          return !trackIds.contains(trackId);
        });
    playlist
        .getItems()
        .addAll(tracksToAdd);
  }

  private void applyPlaylistNameUpdate(PlaylistModel playlist, String newName, UUID userId) {
    if (isPlaylistExisting(newName, userId)) {
      var msg = "Playlist with name: '" + newName + "' already exists";
      throw new PlaylistAlreadyExistsException(msg);
    }
    playlist.setName(newName);
  }

  private PlaylistModel getPlaylist(UUID id, UUID userId) {
    return playlistRepository
        .findByIdAndUserId(id, userId)
        .orElseThrow(() -> {
          var msg = "Playlist with ID '" + id + "' not found";
          return new PlaylistNotFoundException(msg);
        });
  }

  private PlaylistContentModel toPlaylistContentModel(String track, PlaylistModel playlistModel) {
    return PlaylistContentModel
        .builder()
        .trackId(track)
        .playlist(playlistModel)
        .build();
  }

  private boolean isPlaylistExisting(String name, UUID userId) {
    return playlistRepository.existsByNameAndUserId(name, userId);
  }

  private void setId(PlaylistModel playlistModel, UUID id) {
    playlistModel.setId((id != null) ? id : UUID.randomUUID());
  }

  private PlaylistModel savePlaylistAndGetResult(
      PlaylistModel playlist
  ) {
    var saved = playlistRepository.saveAndFlush(playlist);
    entityManager.refresh(saved);
    return saved;
  }
}
