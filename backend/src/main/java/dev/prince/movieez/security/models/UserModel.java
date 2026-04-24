package dev.prince.movieez.security.models;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
public class UserModel {

  @Id
  @Column(name = "id", nullable = false)
  private UUID id;

  @Size(max = 100)
  @Column(name = "username", length = 100)
  private String username;

  @Size(max = 255)
  @Column(name = "email")
  private String email;

  @OneToMany(
      mappedBy = "user", orphanRemoval = true, cascade = { CascadeType.REMOVE, CascadeType.MERGE, CascadeType.PERSIST }
  )
  private List<PlaylistModel> playlistModels = new ArrayList<>();
}