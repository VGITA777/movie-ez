package dev.prince.movieez.security.dto;

import dev.prince.movieez.security.models.UserModel;
import java.util.Collections;
import java.util.List;

public final class UserSummaryMapper {

  private UserSummaryMapper() {
  }

  public static List<UserSummaryDto> toDtoList(List<UserModel> models) {
    if (models == null || models.isEmpty()) {
      return Collections.emptyList();
    }

    return models
        .stream()
        .map(UserSummaryMapper::toDto)
        .toList();
  }

  public static UserSummaryDto toDto(UserModel model) {
    if (model == null) {
      return null;
    }

    return new UserSummaryDto(model.getId(), model.getUsername(), model.getEmail());
  }

  public static List<UserModel> toModelList(List<UserSummaryDto> dtos) {
    if (dtos == null || dtos.isEmpty()) {
      return Collections.emptyList();
    }

    return dtos
        .stream()
        .map(UserSummaryMapper::toModel)
        .toList();
  }

  public static UserModel toModel(UserSummaryDto dto) {
    if (dto == null) {
      return null;
    }

    UserModel model = new UserModel();
    model.setId(dto.id());
    model.setUsername(dto.username());
    model.setEmail(dto.email());
    return model;
  }
}
