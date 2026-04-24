package dev.prince.movieez.exceptions;

public class PlaylistContentAlreadyExistsException extends RuntimeException {

  public PlaylistContentAlreadyExistsException(String s) {
    super(s);
  }

  public PlaylistContentAlreadyExistsException() {
    super();
  }
}
