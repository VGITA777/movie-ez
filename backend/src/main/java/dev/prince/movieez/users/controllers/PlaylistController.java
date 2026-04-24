package dev.prince.movieez.users.controllers;

import dev.prince.movieez.ServerResponse;
import dev.prince.movieez.security.SecurityUtils;
import dev.prince.movieez.security.dto.PlaylistContentDto;
import dev.prince.movieez.security.dto.PlaylistContentMapper;
import dev.prince.movieez.security.dto.PlaylistDto;
import dev.prince.movieez.security.dto.PlaylistMapper;
import dev.prince.movieez.security.models.PlaylistModel;
import dev.prince.movieez.users.services.PlaylistService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
        .findAllByUserId(SecurityUtils.getUserId())
        .stream()
        .map(PlaylistMapper::toDto)
        .toList();

    var response = ServerResponse.success(playlists);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{name}")
  public ResponseEntity<ServerResponse<Optional<PlaylistDto>>> getPlaylistByName(
      @PathVariable
      @Valid
      @NotBlank
      String name
  ) {
    var playlist = playlistService
        .find(name, SecurityUtils.getUserId())
        .map(PlaylistMapper::toDto);

    var response = ServerResponse.success(playlist);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{name}/tracks")
  public ResponseEntity<ServerResponse<List<PlaylistContentDto>>> getPlaylistContents(
      @PathVariable
      @Valid
      @NotBlank
      String name
  ) {
    var playlist = playlistService
        .find(name, SecurityUtils.getUserId())
        .orElseThrow(() -> new IllegalArgumentException("Playlist with name: '" + name + "' not found"));

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
      @NotBlank
      String name
  ) {
    var playlist = new PlaylistModel();
    playlist.setName(name);
    var userId = SecurityUtils.getUserId();
    var saved = playlistService.save(playlist, userId);
    var response = ServerResponse.success(PlaylistMapper.toDto(saved));
    return ResponseEntity.ok(response);
  }

  @PostMapping("/{name}/tracks/{trackId}")
  public ResponseEntity<ServerResponse<PlaylistDto>> addTrackToPlaylist(
      @PathVariable
      @Valid
      @NotBlank
      String name,
      @PathVariable
      String trackId
  ) {
    var updated = playlistService.addToPlaylist(name, trackId, SecurityUtils.getUserId());
    var response = ServerResponse.success(PlaylistMapper.toDto(updated));
    return ResponseEntity.ok(response);
  }

  @PostMapping("/{name}/tracks")
  public ResponseEntity<ServerResponse<PlaylistDto>> addAllTracksToPlaylist(
      @PathVariable
      @Valid
      @NotBlank
      String name,
      @RequestBody
      Set<String> trackIds
  ) {
    var updated = playlistService.addToPlaylist(name, trackIds, SecurityUtils.getUserId());
    var response = ServerResponse.success(PlaylistMapper.toDto(updated));
    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{name}")
  public ResponseEntity<ServerResponse<?>> deletePlaylist(
      @PathVariable
      @Valid
      @NotBlank
      String name
  ) {
    playlistService.delete(name, SecurityUtils.getUserId());
    return ResponseEntity.ok(ServerResponse.success("Playlist with name: '" + name + "' deleted successfully", null));
  }

  @DeleteMapping("/{name}/tracks/{trackId}")
  public ResponseEntity<ServerResponse<?>> deleteTrackFromPlaylist(
      @PathVariable
      @Valid
      @NotBlank
      String name,
      @PathVariable
      String trackId
  ) {
    var response = playlistService.deleteTrackFromPlaylist(name, trackId, SecurityUtils.getUserId());
    return ResponseEntity.ok(ServerResponse.success(PlaylistMapper.toDto(response)));
  }
}
