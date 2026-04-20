package dev.prince.movieez.user.services;

import dev.prince.movieez.user.models.MovieEzPlaylistContentModel;
import dev.prince.movieez.user.repository.MovieEzPlaylistContentsRepository;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class MovieEzPlaylistContentsService {

  private final MovieEzPlaylistContentsRepository movieEzPlaylistContentsRepository;

  public MovieEzPlaylistContentsService(MovieEzPlaylistContentsRepository movieEzPlaylistContentsRepository) {
    this.movieEzPlaylistContentsRepository = movieEzPlaylistContentsRepository;
  }

  public MovieEzPlaylistContentModel save(MovieEzPlaylistContentModel movieEzPlaylistContentModel) {
    return movieEzPlaylistContentsRepository.save(movieEzPlaylistContentModel);
  }

  public Optional<MovieEzPlaylistContentModel> get(UUID id) {
    return movieEzPlaylistContentsRepository.findById(id);
  }

  public void delete(UUID id) {
    movieEzPlaylistContentsRepository.deleteById(id);
  }

  public void delete(MovieEzPlaylistContentModel movieEzPlaylistContentModel) {
    movieEzPlaylistContentsRepository.delete(movieEzPlaylistContentModel);
  }
}
