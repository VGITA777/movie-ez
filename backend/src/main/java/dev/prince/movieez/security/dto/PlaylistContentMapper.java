package dev.prince.movieez.security.dto;

import dev.prince.movieez.security.models.PlaylistContentModel;
import dev.prince.movieez.security.models.PlaylistModel;
import java.util.Collections;
import java.util.List;

public final class PlaylistContentMapper {

  private PlaylistContentMapper() {
  }

  public static List<PlaylistContentDto> toDtoList(List<PlaylistContentModel> models) {
    if (models == null || models.isEmpty()) {
      return Collections.emptyList();
    }

    return models
        .stream()
        .map(PlaylistContentMapper::toDto)
        .toList();
  }

  public static PlaylistContentDto toDto(PlaylistContentModel model) {
    if (model == null) {
      return null;
    }

    return new PlaylistContentDto(
        model.getId(),
        model.getPlaylist() != null ? model
                                      .getPlaylist()
                                      .getId() : null,
        model.getTrackId()
    );
  }

  public static PlaylistContentModel toModel(PlaylistContentDto dto, PlaylistModel playlistModel) {
    PlaylistContentModel model = toModel(dto);
    if (model == null) {
      return null;
    }

    model.setPlaylist(playlistModel);
    return model;
  }

  public static PlaylistContentModel toModel(PlaylistContentDto dto) {
    if (dto == null) {
      return null;
    }

    PlaylistContentModel model = new PlaylistContentModel();
    model.setId(dto.id());
    model.setTrackId(dto.trackId());

    if (dto.playlistId() != null) {
      PlaylistModel playlistModel = new PlaylistModel();
      playlistModel.setId(dto.playlistId());
      model.setPlaylist(playlistModel);
    }

    return model;
  }

  public static List<PlaylistContentModel> toModelList(List<PlaylistContentDto> dtos) {
    if (dtos == null || dtos.isEmpty()) {
      return Collections.emptyList();
    }

    return dtos
        .stream()
        .map(PlaylistContentMapper::toModel)
        .toList();
  }
}

