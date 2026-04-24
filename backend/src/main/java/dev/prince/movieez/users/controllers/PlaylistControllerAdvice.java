package dev.prince.movieez.users.controllers;

import dev.prince.movieez.ServerResponse;
import dev.prince.movieez.exceptions.PlaylistContentAlreadyExistsException;
import dev.prince.movieez.exceptions.PlaylistNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(assignableTypes = PlaylistController.class)
public class PlaylistControllerAdvice {

  @ExceptionHandler(PlaylistNotFoundException.class)
  public ResponseEntity<ServerResponse<?>> handleNotFound(PlaylistNotFoundException ex) {
    var response = ServerResponse.failure(ex.getMessage(), null);
    return ResponseEntity
        .status(HttpStatus.NOT_FOUND)
        .body(response);
  }

  @ExceptionHandler(PlaylistContentAlreadyExistsException.class)
  public ResponseEntity<ServerResponse<?>> handleConflict(PlaylistContentAlreadyExistsException ex) {
    var response = ServerResponse.failure(ex.getMessage(), null);
    return ResponseEntity
        .status(HttpStatus.CONFLICT)
        .body(response);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ServerResponse<?>> handleUnexpected(Exception ex) {
    var message = (ex.getMessage() == null || ex
        .getMessage()
        .isBlank()
                  ) ? "Unexpected error" : ex.getMessage();
    var response = ServerResponse.failure(message, null);
    return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(response);
  }
}

