package dev.prince.movieez.users.services;

import dev.prince.movieez.exceptions.PlaylistContentAlreadyExistsException;
import dev.prince.movieez.exceptions.PlaylistNotFoundException;
import dev.prince.movieez.security.models.PlaylistContentModel;
import dev.prince.movieez.security.models.PlaylistModel;
import dev.prince.movieez.security.models.UserModel;
import dev.prince.movieez.security.repositories.PlaylistContentRepository;
import dev.prince.movieez.security.repositories.PlaylistRepository;
import jakarta.transaction.Transactional;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Transactional
@Service
public class PlaylistService {

  private final PlaylistRepository playlistRepository;
  private final PlaylistContentRepository playlistContentRepository;

  public PlaylistService(PlaylistRepository playlistRepository, PlaylistContentRepository playlistContentRepository) {
    this.playlistRepository = playlistRepository;
    this.playlistContentRepository = playlistContentRepository;
  }

  public PlaylistModel save(PlaylistModel playlistModel, UUID userId) {
    var user = new UserModel();
    user.setId(userId);
    playlistModel.setUser(user);
    return playlistRepository.save(playlistModel);
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

  @Transactional
  public PlaylistModel addToPlaylist(String name, Set<String> trackIds, UUID userId) {
    var playlist = getPlaylist(name, userId);
    var existingTracks = playlist
        .getItems()
        .stream()
        .map(PlaylistContentModel::getTrackId)
        .collect(Collectors.toSet());
    var tracksToAdd = new HashSet<>(trackIds);
    tracksToAdd.removeAll(existingTracks);

    var trackModels = tracksToAdd
        .stream()
        .map(track -> toPlaylistContentModel(track, playlist))
        .toList();
    playlist
        .getItems()
        .addAll(trackModels);

    return playlistRepository.save(playlist);
  }

  public void delete(UUID id) {
    var existing = playlistRepository.existsById(id);
    if (!existing) {
      throw new PlaylistNotFoundException("Playlist with ID: '" + id + "' not found");
    }

    playlistRepository.deleteById(id);
  }

  public void delete(String name, UUID userId) {
    var existing = playlistRepository.findByNameAndUserId(name, userId);
    if (existing.isEmpty()) {
      throw new PlaylistNotFoundException("Playlist with name: '" + name + "' not found");
    }

    playlistRepository.deleteByNameAndUserId(name, userId);
  }
}
