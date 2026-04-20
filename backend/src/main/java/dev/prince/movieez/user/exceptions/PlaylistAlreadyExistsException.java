package dev.prince.movieez.user.exceptions;

public class PlaylistAlreadyExistsException extends ResourceAlreadyExistsException {

  public PlaylistAlreadyExistsException(String message) {
    super(message);
  }
}
