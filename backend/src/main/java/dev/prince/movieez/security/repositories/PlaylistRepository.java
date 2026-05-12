package dev.prince.movieez.security.repositories;

import dev.prince.movieez.security.models.PlaylistModel;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaylistRepository extends JpaRepository<PlaylistModel, UUID> {

  Optional<PlaylistModel> findByNameIgnoreCaseAndUserIdAndDeletedOnIsNull(String name, UUID userId);

  List<PlaylistModel> findAllByUserId(UUID userId);

  Optional<PlaylistModel> findByIdAndUserId(UUID id, UUID userId);

  boolean existsByNameIgnoreCaseAndUserIdAndDeletedOnIsNull(String name, UUID userId);

  Optional<PlaylistModel> findByIdAndUserIdAndDeletedOnIsNull(UUID id, UUID userId);

  List<PlaylistModel> findAllByUserIdAndDeletedOnIsNull(UUID uuid);
}
