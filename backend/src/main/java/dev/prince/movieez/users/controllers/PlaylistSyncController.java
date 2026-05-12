package dev.prince.movieez.users.controllers;

import dev.prince.movieez.ServerResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users/playlists/sync")
public class PlaylistSyncController {

  /* TODO: Return the synced playlist */
  @PostMapping("")
  public ServerResponse<?> syncPlaylists() {
    return ServerResponse.success("Playlists synced successfully");
  }
}
