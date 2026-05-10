package dev.prince.movieez.users.services;

import dev.prince.movieez.exceptions.PlaylistAlreadyExistsException;
import dev.prince.movieez.exceptions.PlaylistContentAlreadyExistsException;
import dev.prince.movieez.exceptions.PlaylistNotFoundException;
import dev.prince.movieez.exceptions.UserNotFoundException;
import dev.prince.movieez.security.models.PlaylistContentModel;
import dev.prince.movieez.security.models.PlaylistModel;
import dev.prince.movieez.security.repositories.PlaylistContentRepository;
import dev.prince.movieez.security.repositories.PlaylistRepository;
import dev.prince.movieez.security.repositories.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
  public PlaylistModel save(PlaylistModel playlistModel, UUID userId) {
    var user = userRepository
        .findById(userId)
        .orElseThrow(() -> {
          var msg = "User with ID: '" + userId + "' not found";
          return new UserNotFoundException(msg);
        });
    playlistModel.setUser(user);
    return playlistRepository.save(playlistModel);
  }

  @Transactional
  public PlaylistModel updatePlaylistName(String oldName, String newName, UUID userId) {
    var playlist = getPlaylist(oldName, userId);
    if (isPlaylistExisting(newName, userId)) {
      var msg = "Playlist with name: '" + newName + "' already exists";
      throw new PlaylistAlreadyExistsException(msg);
    }
    playlist.setName(newName);
    return playlistRepository.save(playlist);
  }

  @Transactional
  public PlaylistModel createPlaylist(String name, Collection<String> trackIds, UUID userId) {
    var existingPlaylist = playlistRepository.findByNameAndUserId(name, userId);

    if (existingPlaylist.isPresent()) {
      return existingPlaylist.get();
    }

    var playlistModel = new PlaylistModel();
    playlistModel.setName(name);

    var savedPlaylist = save(playlistModel, userId);

    var tracks = trackIds
        .stream()
        .filter(trackId -> !trackId.isBlank())
        .map(trackId -> toPlaylistContentModel(trackId, savedPlaylist))
        .collect(Collectors.toCollection(java.util.ArrayList::new));

    playlistModel.setItems(tracks);
    return save(playlistModel, userId);
  }

  public Optional<PlaylistModel> find(String name, UUID userId) {
    return playlistRepository.findByNameAndUserId(name, userId);
  }

  public List<PlaylistModel> findAllByUserId(UUID uuid) {
    return playlistRepository.findAllByUserId(uuid);
  }

  @Transactional
  public PlaylistModel addToPlaylist(String name, String trackId, UUID userId) {
    var playlist = getPlaylist(name, userId);

    boolean alreadyExists = playlistContentRepository.existsByPlaylistIdAndTrackId(playlist.getId(), trackId);
    if (alreadyExists) {
      throw new PlaylistContentAlreadyExistsException(
          "Track with ID: '" + trackId + "' already exists in this playlist");
    }

    var track = toPlaylistContentModel(trackId, playlist);
    playlist
        .getItems()
        .add(track);
    return playlistRepository.save(playlist);
  }

  @Transactional
  public PlaylistModel addToPlaylist(String name, Collection<String> trackIds, UUID userId) {
    var playlist = getPlaylist(name, userId);
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

    return playlistRepository.save(playlist);
  }

  @Transactional
  public void delete(String name, UUID userId) {
    var existing = playlistRepository.findByNameAndUserId(name, userId);
    if (existing.isEmpty()) {
      throw new PlaylistNotFoundException("Playlist with name: '" + name + "' not found");
    }

    playlistRepository.deleteByNameAndUserId(name, userId);
  }

  @Transactional
  public PlaylistModel deleteTrackFromPlaylist(String name, String trackId, UUID userId) {
    var playlist = getPlaylist(name, userId);
    playlist
        .getItems()
        .removeIf(item -> item
            .getTrackId()
            .equals(trackId));
    return playlistRepository.save(playlist);
  }

  @Transactional
  public PlaylistModel deleteAllTracksFromPlaylist(
      @Valid
      @NotBlank
      String name,
      @Valid
      @NotNull
      Collection<String> trackIds, UUID userId
  ) {
    var playlist = getPlaylist(name, userId);
    playlist
        .getItems()
        .removeIf(item -> trackIds.contains(item.getTrackId()));
    return playlistRepository.save(playlist);
  }

  private PlaylistModel getPlaylist(String name, UUID userId) {
    return playlistRepository
        .findByNameAndUserId(name, userId)
        .orElseThrow(() -> {
          var msg = "Playlist with name '" + name + "' not found";
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
}
