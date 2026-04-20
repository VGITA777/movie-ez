package dev.prince.movieez.shared.models.responses;

public record ServerAuthenticationResponse(String message,
                                           Object details,
                                           boolean success) {

  public static ServerAuthenticationResponse success(String message, Object details) {
    return new ServerAuthenticationResponse(message, details, true);
  }

  public static ServerAuthenticationResponse failure(String message, Object details) {
    return new ServerAuthenticationResponse(message, details, false);
  }
}
