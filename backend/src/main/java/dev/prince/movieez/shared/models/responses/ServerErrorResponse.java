package dev.prince.movieez.shared.models.responses;

import dev.prince.movieez.shared.models.ErrorModel;
import java.util.List;

public record ServerErrorResponse(String message,
                                  List<ErrorModel> errors) {

  public ServerErrorResponse(String message, ErrorModel errorModel) {
    this(message, List.of(errorModel));
  }
}
