package dev.prince.movieez.exceptions;

public class PlaylistCreationFailure extends RuntimeException {

  public PlaylistCreationFailure(String message) {
    super(message);
  }

  public PlaylistCreationFailure(String message, Throwable cause) {
    super(message, cause);
  }

  public PlaylistCreationFailure() {
    super();
  }
}
