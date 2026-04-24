package dev.prince.movieez.users.controllers;

import dev.prince.movieez.ServerResponse;
import dev.prince.movieez.security.dto.PlaylistContentDto;
import dev.prince.movieez.security.dto.PlaylistContentMapper;
import dev.prince.movieez.security.dto.PlaylistDto;
import dev.prince.movieez.security.dto.PlaylistMapper;
import dev.prince.movieez.security.models.PlaylistModel;
import dev.prince.movieez.users.services.PlaylistService;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
  public ResponseEntity<ServerResponse<List<PlaylistDto>>> getPlaylists(
      @AuthenticationPrincipal
      UUID uuid
  ) {
    var playlists = playlistService
        .findAllByUserId(uuid)
        .stream()
        .map(PlaylistMapper::toDto)
        .toList();

    var response = ServerResponse.success(playlists);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{name}")
  public ResponseEntity<ServerResponse<Optional<PlaylistDto>>> getPlaylistByName(
      @AuthenticationPrincipal
      UUID uuid,
      @PathVariable
      String name
  ) {
    var playlist = playlistService
        .find(name, uuid)
        .map(PlaylistMapper::toDto);

    var response = ServerResponse.success(playlist);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{name}/tracks")
  public ResponseEntity<ServerResponse<List<PlaylistContentDto>>> getPlaylistContents(
      @AuthenticationPrincipal
      UUID uuid,
      @PathVariable
      String name
  ) {
    var playlist = playlistService
        .find(name, uuid)
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
      @AuthenticationPrincipal
      UUID uuid,
      @PathVariable
      String name
  ) {
    var playlist = new PlaylistModel();
    playlist.setName(name);
    var saved = playlistService.save(playlist, uuid);
    var response = ServerResponse.success(PlaylistMapper.toDto(saved));
    return ResponseEntity.ok(response);
  }

  @PostMapping("/{name}/tracks/{trackId}")
  public ResponseEntity<ServerResponse<PlaylistDto>> addTrackToPlaylist(
      @AuthenticationPrincipal
      UUID uuid,
      @PathVariable
      String name,
      @PathVariable
      String trackId
  ) {
    var updated = playlistService.addToPlaylist(name, trackId, uuid);
    var response = ServerResponse.success(PlaylistMapper.toDto(updated));
    return ResponseEntity.ok(response);
  }

  @PostMapping("/{name}/tracks")
  public ResponseEntity<ServerResponse<PlaylistDto>> addAllTracksToPlaylist(
      @AuthenticationPrincipal
      UUID uuid,
      @PathVariable
      String name,
      @RequestBody
      Set<String> trackIds
  ) {
    var updated = playlistService.addToPlaylist(name, trackIds, uuid);
    var response = ServerResponse.success(PlaylistMapper.toDto(updated));
    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{name}")
  public ResponseEntity<ServerResponse<?>> deletePlaylist(
      @AuthenticationPrincipal
      UUID uuid,
      @PathVariable
      String name
  ) {
    playlistService.delete(name, uuid);
    return ResponseEntity.ok(ServerResponse.success("Playlist with name: '" + name + "' deleted successfully", null));
  }
}
