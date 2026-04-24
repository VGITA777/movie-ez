package dev.prince.movieez;

public record ServerResponse<T>(String message,
                                T details,
                                boolean success) {

  public static <T> ServerResponse<T> success(String message, T details) {
    return new ServerResponse<>(message, details, true);
  }

  public static <T> ServerResponse<T> success(T details) {
    return new ServerResponse<>("Success", details, true);
  }

  public static <T> ServerResponse<T> failure(String message, T details) {
    return new ServerResponse<>(message, details, false);
  }

  public static <T> ServerResponse<T> failure(T details) {
    return new ServerResponse<>("Failure", details, false);
  }
}
