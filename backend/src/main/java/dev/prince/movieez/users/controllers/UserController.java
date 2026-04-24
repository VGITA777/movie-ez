package dev.prince.movieez.users.controllers;

import dev.prince.movieez.ServerResponse;
import dev.prince.movieez.security.dto.UserDto;
import dev.prince.movieez.security.dto.UserMapper;
import dev.prince.movieez.security.dto.UserSummaryDto;
import dev.prince.movieez.security.dto.UserSummaryMapper;
import dev.prince.movieez.users.services.UserService;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/current")
  public ResponseEntity<ServerResponse<UserDto>> getCurrentUser(
      @AuthenticationPrincipal
      UUID id
  ) {
    var currentUser = UserMapper.toDto(userService.find(id));
    var response = ServerResponse.success(currentUser);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/current/summary")
  public ResponseEntity<ServerResponse<UserSummaryDto>> getCurrentUserSummary(
      @AuthenticationPrincipal
      UUID id
  ) {
    var currentUser = userService.find(id);
    var summary = UserSummaryMapper.toDto(currentUser);
    var response = ServerResponse.success(summary);
    return ResponseEntity.ok(response);
  }
}
