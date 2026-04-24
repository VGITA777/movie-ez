package dev.prince.movieez.security.repositories;

import dev.prince.movieez.security.models.PlaylistContentModel;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaylistContentRepository extends JpaRepository<PlaylistContentModel, UUID> {

  boolean existsByPlaylistIdAndTrackId(UUID playlistId, String trackId);

}
