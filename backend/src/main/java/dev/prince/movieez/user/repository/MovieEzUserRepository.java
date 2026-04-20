package dev.prince.movieez.user.repository;

import dev.prince.movieez.user.models.MovieEzUserModel;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieEzUserRepository extends JpaRepository<MovieEzUserModel, UUID> {

  Optional<MovieEzUserModel> findByEmail(String email);

  Optional<MovieEzUserModel> findByUsername(String username);

  boolean existsByEmail(String email);

  boolean existsByUsername(String username);
}
