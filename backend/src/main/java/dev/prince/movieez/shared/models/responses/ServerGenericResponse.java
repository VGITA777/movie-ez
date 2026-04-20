package dev.prince.movieez.shared.models.responses;

public record ServerGenericResponse(String message,
                                    Object details,
                                    boolean success) {

  public static ServerGenericResponse success(String message, Object details) {
    return new ServerGenericResponse(message, details, true);
  }

  public static ServerGenericResponse failure(String message, Object details) {
    return new ServerGenericResponse(message, details, false);
  }
}
