package dev.prince.movieez.exceptions;

public class PlaylistNotFoundException extends RuntimeException {

  public PlaylistNotFoundException() {
    super();
  }

  public PlaylistNotFoundException(String message) {
    super(message);
  }
}
