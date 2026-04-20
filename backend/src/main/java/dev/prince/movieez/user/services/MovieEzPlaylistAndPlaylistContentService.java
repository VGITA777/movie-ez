package dev.prince.movieez.user.services;

import dev.prince.movieez.user.exceptions.PlaylistAlreadyExistsException;
import dev.prince.movieez.user.exceptions.PlaylistContentNotFoundException;
import dev.prince.movieez.user.exceptions.PlaylistNotFoundException;
import dev.prince.movieez.user.models.MovieEzPlaylistContentModel;
import dev.prince.movieez.user.models.MovieEzUserModel;
import dev.prince.movieez.user.models.MovieEzUserPlaylistModel;
import dev.prince.movieez.user.repository.MovieEzUserPlaylistRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class MovieEzPlaylistAndPlaylistContentService {

  private final MovieEzUserPlaylistRepository playlistRepository;

  public MovieEzPlaylistAndPlaylistContentService(MovieEzUserPlaylistRepository playlistRepository) {
    this.playlistRepository = playlistRepository;
  }

  /**
   * Creates a playlist for a user. Each user's playlist name should be unique.
   *
   * @param playlistName the name of the playlist.
   * @param userId       a {@link UUID} representing the user's id.
   *
   * @return the created {@link MovieEzUserPlaylistModel}
   *
   * @throws PlaylistAlreadyExistsException when creating a playlist that already exists.
   */
  @Transactional
  public MovieEzUserPlaylistModel createPlaylist(String playlistName, UUID userId) {
    Optional<MovieEzUserPlaylistModel> optionalPlaylist = playlistRepository.findByNameAndUserId(playlistName, userId);
    if (optionalPlaylist.isPresent()) {
      throw new PlaylistAlreadyExistsException("Playlist with name: '" + playlistName + "' already exists");
    }
    MovieEzUserModel user = MovieEzUserModel.builder().id(userId).build();
    MovieEzUserPlaylistModel playlist = MovieEzUserPlaylistModel.builder().user(user).name(playlistName).build();
    return playlistRepository.save(playlist);
  }

  /**
   * Saves track to an existing playlist.
   *
   * @param userId       a {@link UUID} representing the user's id.
   * @param playlistName the name of the playlist.
   * @param trackId      the id of the track to save.
   *
   * @return the saved {@link MovieEzUserPlaylistModel}
   *
   * @throws PlaylistNotFoundException when adding a content to a playlist that does not exist.
   */
  @Transactional
  public MovieEzUserPlaylistModel addToPlaylist(UUID userId, String playlistName, String trackId) {
    MovieEzUserPlaylistModel playlistModel = playlistRepository.findByNameAndUserId(playlistName, userId)
                                                               .orElseThrow(() -> new PlaylistNotFoundException(
                                                                   "Playlist with name: '" + playlistName +
                                                                   "' does not exists"));
    MovieEzPlaylistContentModel playlistContent = MovieEzPlaylistContentModel.builder()
                                                                             .playlist(playlistModel)
                                                                             .trackId(trackId)
                                                                             .build();
    playlistModel.addContents(playlistContent);
    return playlistRepository.save(playlistModel);
  }

  /**
   * Saves track to an existing playlist.
   *
   * @param userId     a {@link UUID} representing the user's id.
   * @param playlistId the id of the playlist.
   * @param trackId    the id of the track to save.
   *
   * @return the updated {@link MovieEzUserPlaylistModel}
   *
   * @throws PlaylistNotFoundException when adding a content to a playlist that does not exist.
   */
  @Transactional
  public MovieEzUserPlaylistModel addToPlaylist(UUID userId, UUID playlistId, String trackId) {
    MovieEzUserPlaylistModel playlistModel = playlistRepository.findByIdAndUserId(playlistId, userId)
                                                               .orElseThrow(() -> new PlaylistNotFoundException(
                                                                   "Playlist with id: '" + playlistId +
                                                                   "' does not exists"));
    MovieEzPlaylistContentModel playlistContent = MovieEzPlaylistContentModel.builder()
                                                                             .playlist(playlistModel)
                                                                             .trackId(trackId)
                                                                             .build();
    playlistModel.addContents(playlistContent);
    return playlistRepository.save(playlistModel);
  }

  /**
   * Saves all tracks to an existing playlist.
   *
   * @param userId       a {@link UUID} representing the user's id.
   * @param playlistName the name of the playlist.
   * @param trackIdList  the id of the track to save.
   *
   * @return the saved {@link MovieEzUserPlaylistModel}
   *
   * @throws PlaylistNotFoundException when adding a content to a playlist that does not exist.
   */
  @Transactional
  public MovieEzUserPlaylistModel addAllToPlaylist(UUID userId, String playlistName, List<String> trackIdList) {
    MovieEzUserPlaylistModel playlistModel = playlistRepository.findByNameAndUserId(playlistName, userId)
                                                               .orElseThrow(() -> new PlaylistNotFoundException(
                                                                   "Playlist with name: '" + playlistName +
                                                                   "' does not exists"));
    List<MovieEzPlaylistContentModel> contentsToBeAdded = trackIdList.stream()
                                                                     .map(trackId -> MovieEzPlaylistContentModel.builder()
                                                                                                                .playlist(
                                                                                                                    playlistModel)
                                                                                                                .trackId(
                                                                                                                    trackId)
                                                                                                                .build())
                                                                     .toList();
    playlistModel.addContents(contentsToBeAdded);
    return playlistRepository.save(playlistModel);
  }

  /**
   * Removes a track from an existing playlist.
   *
   * @param userId       a {@link UUID} representing the user's id.
   * @param playlistName the name of the playlist.
   * @param trackId      the {@link UUID} of the media content to be removed.
   *
   * @return the updated {@link MovieEzUserPlaylistModel}
   *
   * @throws PlaylistContentNotFoundException when removing a content from a playlist that does not exist.
   */
  public MovieEzUserPlaylistModel removeFromPlaylist(UUID userId, String playlistName, UUID trackId) {
    MovieEzUserPlaylistModel playlistModel = playlistRepository.findByNameAndUserId(playlistName, userId)
                                                               .orElseThrow(() -> new PlaylistNotFoundException(
                                                                   "Playlist with name: '" + playlistName +
                                                                   "' does not exists"));
    Optional<MovieEzPlaylistContentModel> foundContent = playlistModel.getContents()
                                                                      .stream()
                                                                      .filter(content -> content.getId()
                                                                                                .equals(trackId))
                                                                      .findFirst();
    if (foundContent.isEmpty()) {
      throw new PlaylistContentNotFoundException(
          "Content with id: " + trackId + " does not exists in playlist: " + playlistName);
    }
    playlistModel.removeContent(foundContent.get());
    return playlistRepository.save(playlistModel);
  }

  /**
   * Removes a track from an existing playlist.
   *
   * @param userId       a {@link UUID} representing the user's id.
   * @param playlistName the name of the playlist.
   * @param trackId      the track id of the media to be removed. Not the {@link UUID} representing the content's id.
   *
   * @return the updated {@link MovieEzUserPlaylistModel}
   *
   * @throws PlaylistContentNotFoundException when removing a content from a playlist that does not exist.
   */
  public MovieEzUserPlaylistModel removeFromPlaylist(UUID userId, String playlistName, String trackId) {
    MovieEzUserPlaylistModel playlistModel = playlistRepository.findByNameAndUserId(playlistName, userId)
                                                               .orElseThrow(() -> new PlaylistNotFoundException(
                                                                   "Playlist with name: '" + playlistName +
                                                                   "' does not exists"));
    Optional<MovieEzPlaylistContentModel> foundContent = playlistModel.getContents()
                                                                      .stream()
                                                                      .filter(content -> content.getTrackId()
                                                                                                .equals(trackId))
                                                                      .findFirst();
    if (foundContent.isEmpty()) {
      throw new PlaylistContentNotFoundException(
          "Content with track id: " + trackId + " does not exists in playlist: " + playlistName);
    }
    playlistModel.removeContent(foundContent.get());
    return playlistRepository.save(playlistModel);
  }

  /**
   * Removes all tracks from an existing playlist.
   *
   * @param userId       a {@link UUID} representing the user's id.
   * @param playlistName the name of the playlist.
   * @param trackIdList  the track id list of the media to be removed. Not the {@link UUID} representing the content's
   *                     id.
   *
   * @return the updated {@link MovieEzUserPlaylistModel}
   *
   * @throws PlaylistContentNotFoundException when removing a content from a playlist that does not exist.
   */
  public MovieEzUserPlaylistModel removeAllFromPlaylist(UUID userId, String playlistName, List<String> trackIdList) {
    MovieEzUserPlaylistModel playlistModel = playlistRepository.findByNameAndUserId(playlistName, userId)
                                                               .orElseThrow(() -> new PlaylistNotFoundException(
                                                                   "Playlist with name: '" + playlistName +
                                                                   "' does not exists"));
    playlistModel.removeContent(trackIdList);
    return playlistRepository.save(playlistModel);
  }

}
