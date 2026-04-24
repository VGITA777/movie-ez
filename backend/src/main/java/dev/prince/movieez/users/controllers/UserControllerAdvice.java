package dev.prince.movieez.users.controllers;

import dev.prince.movieez.ServerResponse;
import dev.prince.movieez.exceptions.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice(assignableTypes = UserController.class)
public class UserControllerAdvice {

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<ServerResponse<?>> handleNotFound(UserNotFoundException ex) {
    var response = ServerResponse.failure(ex.getMessage(), null);
    return ResponseEntity
        .status(HttpStatus.NOT_FOUND)
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
