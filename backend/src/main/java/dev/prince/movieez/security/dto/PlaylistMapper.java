package dev.prince.movieez.security.dto;

import dev.prince.movieez.security.models.PlaylistContentModel;
import dev.prince.movieez.security.models.PlaylistModel;
import dev.prince.movieez.security.models.UserModel;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public final class PlaylistMapper {

  private PlaylistMapper() {
  }

  public static List<PlaylistDto> toDtoList(List<PlaylistModel> models) {
    if (models == null || models.isEmpty()) {
      return Collections.emptyList();
    }

    return models
        .stream()
        .map(PlaylistMapper::toDto)
        .toList();
  }

  public static PlaylistDto toDto(PlaylistModel model) {
    if (model == null) {
      return null;
    }

    return new PlaylistDto(
        model.getId(),
        model.getUser() != null ? model
                                  .getUser()
                                  .getId() : null,
        model.getName(),
        PlaylistContentMapper.toDtoList(model.getItems())
    );
  }

  public static PlaylistModel toModel(PlaylistDto dto, UserModel userModel) {
    PlaylistModel model = toModel(dto);
    if (model == null) {
      return null;
    }

    model.setUser(userModel);
    model.setItems(mapItems(dto.items(), model));
    return model;
  }

  public static PlaylistModel toModel(PlaylistDto dto) {
    if (dto == null) {
      return null;
    }

    PlaylistModel model = new PlaylistModel();
    model.setId(dto.id());
    model.setName(dto.name());

    if (dto.userId() != null) {
      UserModel userModel = new UserModel();
      userModel.setId(dto.userId());
      model.setUser(userModel);
    }

    model.setItems(mapItems(dto.items(), model));
    return model;
  }

  private static List<PlaylistContentModel> mapItems(List<PlaylistContentDto> itemDtos, PlaylistModel playlistModel) {
    if (itemDtos == null || itemDtos.isEmpty()) {
      return new ArrayList<>();
    }

    List<PlaylistContentModel> items = new ArrayList<>(itemDtos.size());
    for (PlaylistContentDto itemDto : itemDtos) {
      PlaylistContentModel item = PlaylistContentMapper.toModel(itemDto, playlistModel);
      if (item != null) {
        items.add(item);
      }
    }

    return items;
  }

  public static List<PlaylistModel> toModelList(List<PlaylistDto> dtos) {
    if (dtos == null || dtos.isEmpty()) {
      return Collections.emptyList();
    }

    return dtos
        .stream()
        .map(PlaylistMapper::toModel)
        .toList();
  }
}

