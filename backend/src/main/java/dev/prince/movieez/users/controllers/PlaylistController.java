package dev.prince.movieez.users.controllers;

import dev.prince.movieez.ServerResponse;
import dev.prince.movieez.security.SecurityUtils;
import dev.prince.movieez.security.dto.PlaylistContentDto;
import dev.prince.movieez.security.dto.PlaylistContentMapper;
import dev.prince.movieez.security.dto.PlaylistDto;
import dev.prince.movieez.security.dto.PlaylistMapper;
import dev.prince.movieez.users.models.inputs.CreatePlaylistInput;
import dev.prince.movieez.users.models.inputs.CreatePlaylistsInput;
import dev.prince.movieez.users.models.inputs.NewNameInput;
import dev.prince.movieez.users.models.inputs.PlaylistTrackIdentitiesInput;
import dev.prince.movieez.users.models.inputs.PlaylistTrackIdentityInput;
import dev.prince.movieez.users.models.inputs.PlaylistTrackInfoInput;
import dev.prince.movieez.users.models.inputs.PlaylistTracksInput;
import dev.prince.movieez.users.models.inputs.PlaylistUpdateInput;
import dev.prince.movieez.users.services.PlaylistService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users/playlists")
public class PlaylistController {

  private final PlaylistService playlistService;

  public PlaylistController(PlaylistService playlistService) {
    this.playlistService = playlistService;
  }

  @GetMapping("/all")
  public ResponseEntity<ServerResponse<List<PlaylistDto>>> getPlaylists() {
    var playlists = playlistService
        .findAllByUserIdAndNotDeleted(SecurityUtils.getUserId())
        .stream()
        .map(PlaylistMapper::toDto)
        .toList();

    return ResponseEntity.ok(ServerResponse.success(playlists));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ServerResponse<Optional<PlaylistDto>>> getPlaylistById(
      @PathVariable
      @Valid
      @NotNull(message = "{validation.playlist.id.notNull}")
      UUID id
  ) {
    var playlist = playlistService
        .findNotDeleted(id, SecurityUtils.getUserId())
        .map(PlaylistMapper::toDto);

    return ResponseEntity.ok(ServerResponse.success(playlist));
  }

  @GetMapping("/{id}/tracks")
  public ResponseEntity<ServerResponse<List<PlaylistContentDto>>> getPlaylistContents(
      @PathVariable
      @Valid
      @NotNull(message = "{validation.playlist.id.notNull}")
      UUID id
  ) {
    var playlist = playlistService
        .findNotDeleted(id, SecurityUtils.getUserId())
        .orElseThrow(() -> new IllegalArgumentException("Playlist with ID not found"));

    var contents = playlist
        .getItems()
        .stream()
        .map(PlaylistContentMapper::toDto)
        .toList();

    return ResponseEntity.ok(ServerResponse.success(contents));
  }

  /*
   * Enhanced create endpoint.
   *
   * Name is now in the request body instead of the path because the body also owns:
   * - playlistId
   * - createdOn
   * - tracks
   */
  @PostMapping
  public ResponseEntity<ServerResponse<PlaylistDto>> createPlaylist(
      @Valid
      @NotNull(message = "{validation.playlist.createInput.notNull}")
      @RequestBody
      CreatePlaylistInput input
  ) {
    var saved = playlistService.createPlaylist(input, SecurityUtils.getUserId());
    return ResponseEntity.ok(ServerResponse.success(PlaylistMapper.toDto(saved)));
  }

  @PostMapping("/create/batch")
  public ResponseEntity<ServerResponse<List<PlaylistDto>>> createPlaylists(
      @Valid
      @NotNull(message = "{validation.playlist.createInput.notNull}")
      @RequestBody
      CreatePlaylistsInput input
  ) {
    var saved = playlistService.createPlaylists(input.playlists(), SecurityUtils.getUserId());

    var response = saved
        .stream()
        .map(PlaylistMapper::toDto)
        .toList();

    return ResponseEntity.ok(ServerResponse.success(response));
  }

  @PatchMapping("/{id}/name")
  public ResponseEntity<ServerResponse<PlaylistDto>> updatePlaylistName(
      @PathVariable
      @Valid
      @NotNull(message = "{validation.playlist.id.notNull}")
      UUID id,
      @RequestBody
      @Valid
      @NotNull(message = "{validation.playlist.newNameInput.notNull}")
      NewNameInput input
  ) {
    var updated = playlistService.updatePlaylistName(
        id,
        input.name(),
        SecurityUtils.getUserId()
    );

    return ResponseEntity.ok(ServerResponse.success(PlaylistMapper.toDto(updated)));
  }

  @PostMapping("/{id}/update")
  public ResponseEntity<ServerResponse<PlaylistDto>> updatePlaylist(
      @PathVariable
      @Valid
      @NotNull(message = "{validation.playlist.id.notNull}")
      UUID id,
      @RequestBody
      @Valid
      @NotNull(message = "{validation.playlist.updateInput.notNull}")
      PlaylistUpdateInput input
  ) {
    var updated = playlistService.updatePlaylist(id, input, SecurityUtils.getUserId());
    return ResponseEntity.ok(ServerResponse.success(PlaylistMapper.toDto(updated)));
  }

  /*
   * Add one playlist content.
   *
   * Body must include:
   * - trackId
   * - mediaType
   * - addedOn
   */
  @PostMapping("/{id}/tracks")
  public ResponseEntity<ServerResponse<PlaylistDto>> addTrackToPlaylist(
      @PathVariable
      @Valid
      @NotNull(message = "{validation.playlist.id.notNull}")
      UUID id,
      @RequestBody
      @Valid
      @NotNull(message = "{validation.playlist.trackInput.notNull}")
      PlaylistTrackInfoInput input
  ) {
    var updated = playlistService.addToPlaylist(
        id,
        input,
        SecurityUtils.getUserId()
    );

    return ResponseEntity.ok(ServerResponse.success(PlaylistMapper.toDto(updated)));
  }

  /*
   * Add many playlist contents.
   */
  @PostMapping("/{id}/tracks/batch")
  public ResponseEntity<ServerResponse<PlaylistDto>> addAllTracksToPlaylist(
      @PathVariable
      @Valid
      @NotNull(message = "{validation.playlist.id.notNull}")
      UUID id,
      @RequestBody
      @Valid
      @NotNull(message = "{validation.playlist.tracksInput.notNull}")
      PlaylistTracksInput input
  ) {
    var updated = playlistService.addToPlaylist(
        id,
        input.tracks(),
        SecurityUtils.getUserId()
    );

    return ResponseEntity.ok(ServerResponse.success(PlaylistMapper.toDto(updated)));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<ServerResponse<?>> deletePlaylist(
      @PathVariable
      @Valid
      @NotNull(message = "{validation.playlist.id.notNull}")
      UUID id
  ) {
    playlistService.delete(id, SecurityUtils.getUserId());
    return ResponseEntity.ok(ServerResponse.success("Playlist deleted successfully", null));
  }

  /*
   * Delete one playlist content.
   *
   * Body only needs:
   * - trackId
   * - mediaType
   */
  @DeleteMapping("/{id}/tracks")
  public ResponseEntity<ServerResponse<PlaylistDto>> deleteTrackFromPlaylist(
      @PathVariable
      @Valid
      @NotNull(message = "{validation.playlist.id.notNull}")
      UUID id,
      @RequestBody
      @Valid
      @NotNull(message = "{validation.playlist.trackInput.notNull}")
      PlaylistTrackIdentityInput input
  ) {
    var updated = playlistService.deleteTrackFromPlaylist(
        id,
        input,
        SecurityUtils.getUserId()
    );

    return ResponseEntity.ok(ServerResponse.success(PlaylistMapper.toDto(updated)));
  }

  /*
   * Delete many playlist contents.
   */
  @DeleteMapping("/{id}/tracks/batch")
  public ResponseEntity<ServerResponse<PlaylistDto>> deleteTracksFromPlaylist(
      @PathVariable
      @Valid
      @NotNull(message = "{validation.playlist.id.notNull}")
      UUID id,
      @RequestBody
      @Valid
      @NotNull(message = "{validation.playlist.tracksInput.notNull}")
      PlaylistTrackIdentitiesInput input
  ) {
    var playlist = playlistService.deleteAllTracksFromPlaylist(
        id,
        input.tracks(),
        SecurityUtils.getUserId()
    );

    return ResponseEntity.ok(ServerResponse.success(PlaylistMapper.toDto(playlist)));
  }

  @DeleteMapping("/{id}/tracks/all")
  public ResponseEntity<ServerResponse<PlaylistDto>> deleteAllTracksFromPlaylist(
      @PathVariable
      @Valid
      @NotNull(message = "{validation.playlist.id.notNull}")
      UUID id
  ) {
    var playlist = playlistService.deleteAllTracksFromPlaylist(
        id,
        SecurityUtils.getUserId()
    );

    return ResponseEntity.ok(ServerResponse.success(PlaylistMapper.toDto(playlist)));
  }
}