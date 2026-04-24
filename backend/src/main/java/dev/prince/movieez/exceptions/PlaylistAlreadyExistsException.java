package dev.prince.movieez.exceptions;

public class PlaylistAlreadyExistsException extends RuntimeException {

  public PlaylistAlreadyExistsException() {
    super();
  }

  public PlaylistAlreadyExistsException(String msg) {
    super(msg);
  }
}
