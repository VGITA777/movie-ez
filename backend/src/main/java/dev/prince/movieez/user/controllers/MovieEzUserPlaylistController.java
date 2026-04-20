package dev.prince.movieez.user.controllers;

import dev.prince.movieez.shared.models.responses.ServerGenericResponse;
import dev.prince.movieez.user.dto.MovieEzUserPlaylistDto;
import dev.prince.movieez.user.dto.mappers.MovieEzUserPlaylistDtoMapper;
import dev.prince.movieez.user.exceptions.PlaylistNotFoundException;
import dev.prince.movieez.user.inputs.PlaylistContentsInput;
import dev.prince.movieez.user.models.MovieEzUserPlaylistModel;
import dev.prince.movieez.user.services.MovieEzPlaylistAndPlaylistContentService;
import dev.prince.movieez.user.services.MovieEzUserPlaylistService;
import dev.prince.movieez.user.validators.annotations.Alphanumeric;
import jakarta.validation.Valid;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user/playlist")
public class MovieEzUserPlaylistController {

  private final MovieEzUserPlaylistService movieEzUserPlaylistService;
  private final MovieEzPlaylistAndPlaylistContentService movieEzPlaylistAndPlaylistContentService;
  private final MovieEzUserPlaylistDtoMapper userPlaylistMapper;

  public MovieEzUserPlaylistController(
      MovieEzUserPlaylistService movieEzUserPlaylistService,
      MovieEzPlaylistAndPlaylistContentService movieEzPlaylistAndPlaylistContentService,
      MovieEzUserPlaylistDtoMapper userPlaylistMapper
  ) {
    this.movieEzUserPlaylistService = movieEzUserPlaylistService;
    this.movieEzPlaylistAndPlaylistContentService = movieEzPlaylistAndPlaylistContentService;
    this.userPlaylistMapper = userPlaylistMapper;
  }

  @GetMapping("/all")
  public ResponseEntity<ServerGenericResponse> getAllPlaylists(
      JwtAuthenticationToken token
  ) {
    var uuid = UUID.fromString(token.getName());
    Map<String, MovieEzUserPlaylistDto> response = movieEzUserPlaylistService
        .getAllByUserId(uuid)
        .stream()
        .map(userPlaylistMapper::toDto)
        .collect(Collectors.toMap(MovieEzUserPlaylistDto::name, playlistDto -> playlistDto));
    return ResponseEntity
        .ok()
        .body(ServerGenericResponse.success("Playlists", response));
  }

  @GetMapping("/{playlistName}")
  public ResponseEntity<ServerGenericResponse> getPlaylistByName(
      @PathVariable
      String playlistName, JwtAuthenticationToken token
  ) {
    var uuid = UUID.fromString(token.getName());
    MovieEzUserPlaylistModel playlist = movieEzUserPlaylistService
        .getByNameAndUserId(playlistName, uuid)
        .orElseThrow(() -> new PlaylistNotFoundException("Playlist with name: '" + playlistName + "' does not exists"));
    MovieEzUserPlaylistDto mapped = userPlaylistMapper.toDto(playlist);
    return ResponseEntity
        .ok()
        .body(ServerGenericResponse.success("Playlist", mapped));
  }

  @PostMapping("/{playlistName}")
  public ResponseEntity<ServerGenericResponse> createPlaylist(
      @Alphanumeric
      @PathVariable
      @Valid
      String playlistName, JwtAuthenticationToken token
  ) {
    var uuid = UUID.fromString(token.getName());
    MovieEzUserPlaylistModel playlist = movieEzPlaylistAndPlaylistContentService.createPlaylist(playlistName, uuid);
    MovieEzUserPlaylistDto mapped = userPlaylistMapper.toDto(playlist);
    return ResponseEntity.ok(ServerGenericResponse.success("Playlist created successfully", mapped));
  }

  @PatchMapping("/{playlistName}/add")
  public ResponseEntity<ServerGenericResponse> addAllToPlaylistByName(
      @Alphanumeric
      @Valid
      @PathVariable
      String playlistName,
      @RequestBody
      @Valid
      PlaylistContentsInput playlistContentsInput, JwtAuthenticationToken token
  ) {
    var uuid = UUID.fromString(token.getName());
    MovieEzUserPlaylistModel playlist = movieEzPlaylistAndPlaylistContentService.addAllToPlaylist(
        uuid,
        playlistName,
        playlistContentsInput.trackIds()
    );
    MovieEzUserPlaylistDto mapped = userPlaylistMapper.toDto(playlist);
    return ResponseEntity.ok(ServerGenericResponse.success("Contents added to playlist", mapped));
  }


  @PatchMapping("/{playlistName}/add/{trackId}")
  public ResponseEntity<ServerGenericResponse> addToPlaylistByName(
      @Alphanumeric
      @Valid
      @PathVariable
      String playlistName,
      @Alphanumeric
      @Valid
      @PathVariable
      String trackId, JwtAuthenticationToken token
  ) {
    var uuid = UUID.fromString(token.getName());
    MovieEzUserPlaylistModel playlist = movieEzPlaylistAndPlaylistContentService.addToPlaylist(
        uuid,
        playlistName,
        trackId
    );
    MovieEzUserPlaylistDto mapped = userPlaylistMapper.toDto(playlist);
    return ResponseEntity.ok(ServerGenericResponse.success("Content added to playlist", mapped));
  }

  @DeleteMapping("/{playlistName}/remove")
  public ResponseEntity<ServerGenericResponse> removeAllToPlaylistByName(
      @Alphanumeric
      @Valid
      @PathVariable
      String playlistName,
      @RequestBody
      @Valid
      PlaylistContentsInput playlistContentsInput, JwtAuthenticationToken token
  ) {
    var uuid = UUID.fromString(token.getName());
    MovieEzUserPlaylistModel playlist = movieEzPlaylistAndPlaylistContentService.removeAllFromPlaylist(
        uuid,
        playlistName,
        playlistContentsInput.trackIds()
    );
    MovieEzUserPlaylistDto mapped = userPlaylistMapper.toDto(playlist);
    return ResponseEntity.ok(ServerGenericResponse.success("Contents removed to playlist", mapped));
  }

  @DeleteMapping("/{playlistName}/remove/{trackId}")
  public ResponseEntity<ServerGenericResponse> removeFromPlaylistByName(
      @Alphanumeric
      @Valid
      @PathVariable
      String playlistName,
      @Alphanumeric
      @Valid
      @PathVariable
      String trackId, JwtAuthenticationToken token
  ) {
    var uuid = UUID.fromString(token.getName());
    MovieEzUserPlaylistModel playlist = movieEzPlaylistAndPlaylistContentService.removeFromPlaylist(
        uuid,
        playlistName,
        trackId
    );
    MovieEzUserPlaylistDto mapped = userPlaylistMapper.toDto(playlist);
    return ResponseEntity.ok(ServerGenericResponse.success("Content removed from playlist", mapped));
  }

  @DeleteMapping("/{playlistName}")
  public ResponseEntity<ServerGenericResponse> deletePlaylist(
      @PathVariable
      String playlistName, JwtAuthenticationToken token
  ) {
    var uuid = UUID.fromString(token.getName());
    boolean delete = movieEzUserPlaylistService.delete(playlistName, uuid);
    if (!delete) {
      throw new PlaylistNotFoundException("Playlist with name: '" + playlistName + "' does not exists");
    }
    return ResponseEntity.ok(ServerGenericResponse.success("Playlist deleted successfully", null));
  }
}
