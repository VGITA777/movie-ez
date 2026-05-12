package dev.prince.movieez.users.controllers;

import dev.prince.movieez.ServerResponse;
import dev.prince.movieez.media.models.enums.MediaType;
import dev.prince.movieez.security.SecurityUtils;
import dev.prince.movieez.security.dto.PlaylistContentDto;
import dev.prince.movieez.security.dto.PlaylistContentMapper;
import dev.prince.movieez.security.dto.PlaylistDto;
import dev.prince.movieez.security.dto.PlaylistMapper;
import dev.prince.movieez.users.models.inputs.CreatePlaylistsInput;
import dev.prince.movieez.users.models.inputs.NewNameInput;
import dev.prince.movieez.users.models.inputs.PlaylistAndTracksInput;
import dev.prince.movieez.users.models.inputs.PlaylistTracksInput;
import dev.prince.movieez.users.models.inputs.PlaylistUpdateInput;
import dev.prince.movieez.users.services.PlaylistService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.HashSet;
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

    var response = ServerResponse.success(playlists);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{id}")
  public ResponseEntity<ServerResponse<Optional<PlaylistDto>>> getPlaylistById(
      @PathVariable
      @Valid
      @NotNull(message = "{validation.playlist.id.notNull}")
      UUID id
  ) {
    var data = playlistService.findNotDeleted(id, SecurityUtils.getUserId());
    var playlist = data.map(PlaylistMapper::toDto);
    var response = ServerResponse.success(playlist);
    return ResponseEntity.ok(response);
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

    var response = ServerResponse.success(contents);
    return ResponseEntity.ok(response);
  }

  @PostMapping("/{name}")
  public ResponseEntity<ServerResponse<PlaylistDto>> createPlaylist(
      @PathVariable
      @Valid
      @NotBlank(message = "{validation.playlist.name.notBlank}")
      String name,
      @Valid
      @NotNull(message = "{validation.playlist.tracksInput.notNull}")
      @RequestBody
      PlaylistAndTracksInput input
  ) {
    var userId = SecurityUtils.getUserId();
    var playlistId = input.playlistId();
    var saved = playlistService.createPlaylist(name, new HashSet<>(input.trackIds()), playlistId, userId);
    var response = ServerResponse.success(PlaylistMapper.toDto(saved));
    return ResponseEntity.ok(response);
  }

  @PostMapping("/create/batch")
  public ResponseEntity<ServerResponse<List<PlaylistDto>>> createPlaylists(
      @Valid
      @NotNull(message = "{validation.playlist.createInput.notNull}")
      @RequestBody
      CreatePlaylistsInput input
  ) {
    var userId = SecurityUtils.getUserId();
    var saved = playlistService.createPlaylists(input.playlists(), userId);
    var response = ServerResponse.success(saved
                                              .stream()
                                              .map(PlaylistMapper::toDto)
                                              .toList());
    return ResponseEntity.ok(response);
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
      NewNameInput newName
  ) {
    var updated = playlistService.updatePlaylistName(id, newName.name(), SecurityUtils.getUserId());
    var response = ServerResponse.success(PlaylistMapper.toDto(updated));
    return ResponseEntity.ok(response);
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
    var response = ServerResponse.success(PlaylistMapper.toDto(updated));
    return ResponseEntity.ok(response);
  }

  @PostMapping("/{id}/tracks/{trackId}/{mediaType}")
  public ResponseEntity<ServerResponse<PlaylistDto>> addTrackToPlaylist(
      @PathVariable
      @Valid
      @NotNull(message = "{validation.playlist.id.notNull}")
      UUID id,
      @PathVariable
      String trackId,
      @PathVariable
      MediaType mediaType
  ) {
    var updated = playlistService.addToPlaylist(id, trackId, mediaType, SecurityUtils.getUserId());
    var response = ServerResponse.success(PlaylistMapper.toDto(updated));
    return ResponseEntity.ok(response);
  }

  @PostMapping("/{id}/tracks")
  public ResponseEntity<ServerResponse<PlaylistDto>> addAllTracksToPlaylist(
      @PathVariable
      @Valid
      @NotNull(message = "{validation.playlist.id.notNull}")
      UUID id,
      @RequestBody
      PlaylistTracksInput input
  ) {
    var updated = playlistService.addToPlaylist(id, new HashSet<>(input.tracksIds()), SecurityUtils.getUserId());
    var response = ServerResponse.success(PlaylistMapper.toDto(updated));
    return ResponseEntity.ok(response);
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

  @DeleteMapping("/{id}/tracks/{trackId}")
  public ResponseEntity<ServerResponse<?>> deleteTrackFromPlaylist(
      @PathVariable
      @Valid
      @NotNull(message = "{validation.playlist.id.notNull}")
      UUID id,
      @PathVariable
      String trackId
  ) {
    var response = playlistService.deleteTrackFromPlaylist(id, trackId, SecurityUtils.getUserId());
    return ResponseEntity.ok(ServerResponse.success(PlaylistMapper.toDto(response)));
  }

  @DeleteMapping("/{id}/tracks")
  public ResponseEntity<ServerResponse<PlaylistDto>> deleteTracksFromPlaylist(
      @PathVariable
      @Valid
      @NotNull(message = "{validation.playlist.id.notNull}")
      UUID id,
      @RequestBody
      @Valid
      PlaylistAndTracksInput input
  ) {
    var userId = SecurityUtils.getUserId();
    var playlist = playlistService.deleteAllTracksFromPlaylist(id, new HashSet<>(input.trackIds()), userId);
    var response = ServerResponse.success(PlaylistMapper.toDto(playlist));
    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{id}/tracks/all")
  public ResponseEntity<ServerResponse<PlaylistDto>> deleteAllTracksFromPlaylist(
      @PathVariable
      @Valid
      @NotNull(message = "{validation.playlist.id.notNull}")
      UUID id
  ) {
    var userId = SecurityUtils.getUserId();
    var playlist = playlistService.deleteAllTracksFromPlaylist(id, userId);
    var response = ServerResponse.success(PlaylistMapper.toDto(playlist));
    return ResponseEntity.ok(response);
  }
}

