package dev.prince.movieez.user.models;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

/**
 * A model representing a user's playlist.
 */
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "movieez_user_playlists")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class MovieEzUserPlaylistModel {

  @Id
  @UuidGenerator
  @EqualsAndHashCode.Include
  private UUID id;

  // MAKE SURE THAT EACH USER ONLY HAS ONE PLAYLIST WITH THE SAME NAME
  @Column(nullable = false)
  private String name;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private MovieEzUserModel user;

  @OneToMany(mappedBy = "playlist", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
  @Builder.Default
  private List<MovieEzPlaylistContentModel> contents = new ArrayList<>();

  public void addContents(MovieEzPlaylistContentModel content) {
    content.setPlaylist(this);
    this.contents.add(content);
  }

  public void addContents(Collection<MovieEzPlaylistContentModel> contentList) {
    List<MovieEzPlaylistContentModel> playlistToBeInserted = contentList.stream().filter(e -> {
      if (e == null) {
        return false;
      }
      String trackId = e.getTrackId();
      boolean isTrackIdInContents = contents.stream()
                                            .map(MovieEzPlaylistContentModel::getTrackId)
                                            .anyMatch(trackId::equals);
      return !isTrackIdInContents;
    }).peek(e -> e.setPlaylist(this)).toList();
    this.contents.addAll(playlistToBeInserted);
  }

  public void removeContent(MovieEzPlaylistContentModel content) {
    this.contents.remove(content);
  }

  public void removeContent(List<String> contentList) {
    this.contents.removeIf(e -> contentList.contains(e.getTrackId()));
  }
}