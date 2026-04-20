package dev.prince.movieez.user.repository;

import dev.prince.movieez.user.models.MovieEzUserModel;
import dev.prince.movieez.user.models.MovieEzUserPlaylistModel;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieEzUserPlaylistRepository extends JpaRepository<MovieEzUserPlaylistModel, UUID> {

  List<MovieEzUserPlaylistModel> findAllByUserId(UUID userId);

  Optional<MovieEzUserPlaylistModel> findByNameAndUserId(String name, UUID userId);

  Optional<MovieEzUserPlaylistModel> findByIdAndUserId(UUID id, UUID userId);

  UUID user(MovieEzUserModel user);

  long deleteByNameAndUserId(String name, UUID userId);
}
