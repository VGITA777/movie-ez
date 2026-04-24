package dev.prince.movieez.users.services;

import dev.prince.movieez.security.models.PlaylistContentModel;
import dev.prince.movieez.security.repositories.PlaylistContentRepository;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class PlaylistContentService {

  private final PlaylistContentRepository playlistContentRepository;

  public PlaylistContentService(PlaylistContentRepository playlistContentRepository) {
    this.playlistContentRepository = playlistContentRepository;
  }

  public PlaylistContentModel save(PlaylistContentModel playlist) {
    return playlistContentRepository.save(playlist);
  }

  public Optional<PlaylistContentModel> find(UUID id) {
    return playlistContentRepository.findById(id);
  }

  public void delete(UUID id) {
    playlistContentRepository.deleteById(id);
  }
}
