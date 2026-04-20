package dev.prince.movieez.user.models;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * A model representing a user.
 */
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "movieez_users")
public class MovieEzUserModel {

  @Id
  @EqualsAndHashCode.Include
  private UUID id;

  @Column(unique = true, nullable = false)
  @EqualsAndHashCode.Include
  private String username;

  @Column(unique = true, nullable = false)
  @EqualsAndHashCode.Include
  private String email;

  @Column(nullable = false)
  @EqualsAndHashCode.Include
  private boolean enabled;

  @ToString.Exclude
  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  private List<MovieEzUserPlaylistModel> playlists = new ArrayList<>();


  public void addPlaylist(MovieEzUserPlaylistModel playlist) {
    playlist.setUser(this);
    this.playlists.add(playlist);
  }
}
