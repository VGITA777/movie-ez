package dev.prince.movieez.users.controllers;

import dev.prince.movieez.ServerResponse;
import dev.prince.movieez.security.SecurityUtils;
import dev.prince.movieez.users.models.inputs.PlaylistSyncInput;
import dev.prince.movieez.users.models.responses.PlaylistSyncResponse;
import dev.prince.movieez.users.services.PlaylistSyncService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users/playlists/sync")
public class PlaylistSyncController {

  private final PlaylistSyncService playlistSyncService;

  public PlaylistSyncController(PlaylistSyncService playlistSyncService) {
    this.playlistSyncService = playlistSyncService;
  }

  @PostMapping("")
  public ResponseEntity<ServerResponse<PlaylistSyncResponse>> syncPlaylists(
      @RequestBody
      @Valid
      PlaylistSyncInput input
  ) {
    var userId = SecurityUtils.getUserId();
    var result = playlistSyncService.syncPlaylists(input.playlists(), userId);
    var response = ServerResponse.success(result);
    return ResponseEntity.ok(response);
  }
}
