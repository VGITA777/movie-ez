package dev.prince.movieez.user.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

/**
 * A model representing a single content from a user's playlist.
 */
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
    name = "movieez_playlist_contents",
    uniqueConstraints = { @UniqueConstraint(columnNames = { "playlist_id", "trackId" }) }
)
public class MovieEzPlaylistContentModel {

  @Id
  @UuidGenerator
  @EqualsAndHashCode.Include
  private UUID id;

  @Column(nullable = false)
  @EqualsAndHashCode.Include
  private String trackId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "playlist_id", nullable = false)
  private MovieEzUserPlaylistModel playlist;
}