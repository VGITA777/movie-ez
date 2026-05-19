package dev.prince.movieez.security.models;

import dev.prince.movieez.media.models.enums.MediaType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@Entity
@Table(name = "playlist_content")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
public class PlaylistContentModel {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "id", nullable = false)
  @EqualsAndHashCode.Include
  private UUID id;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "playlist_id", nullable = false)
  private PlaylistModel playlist;

  @NotNull
  @Builder.Default
  @Enumerated(EnumType.STRING)
  @Column(name = "media_type", nullable = false, length = 20)
  @EqualsAndHashCode.Include
  private MediaType mediaType = MediaType.MOVIE;

  @NotNull
  @Column(name = "track_id", nullable = false, length = Integer.MAX_VALUE)
  @EqualsAndHashCode.Include
  private String trackId;

  @Column(name = "added_on", nullable = false, updatable = false)
  private Instant addedOn;
}