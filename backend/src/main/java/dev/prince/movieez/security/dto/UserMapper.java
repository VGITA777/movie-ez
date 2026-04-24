package dev.prince.movieez.security.dto;

import dev.prince.movieez.security.models.PlaylistModel;
import dev.prince.movieez.security.models.UserModel;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public final class UserMapper {

  private UserMapper() {
  }

  public static List<UserDto> toDtoList(List<UserModel> models) {
    if (models == null || models.isEmpty()) {
      return Collections.emptyList();
    }

    return models
        .stream()
        .map(UserMapper::toDto)
        .toList();
  }

  public static UserDto toDto(UserModel model) {
    if (model == null) {
      return null;
    }

    return new UserDto(
        model.getId(),
                       model.getUsername(),
                       model.getEmail(),
                       PlaylistMapper.toDtoList(model.getPlaylistModels())
    );
  }

  public static List<UserModel> toModelList(List<UserDto> dtos) {
    if (dtos == null || dtos.isEmpty()) {
      return Collections.emptyList();
    }

    return dtos
        .stream()
        .map(UserMapper::toModel)
        .toList();
  }

  public static UserModel toModel(UserDto dto) {
    if (dto == null) {
      return null;
    }

    UserModel model = new UserModel();
    model.setId(dto.id());
    model.setUsername(dto.username());
    model.setEmail(dto.email());

    model.setPlaylistModels(mapPlaylists(dto.playlists(), model));
    return model;
  }

  private static List<PlaylistModel> mapPlaylists(List<PlaylistDto> playlistDtos, UserModel userModel) {
    if (playlistDtos == null || playlistDtos.isEmpty()) {
      return new ArrayList<>();
    }

    List<PlaylistModel> playlists = new ArrayList<>(playlistDtos.size());
    for (PlaylistDto playlistDto : playlistDtos) {
      PlaylistModel playlist = PlaylistMapper.toModel(playlistDto, userModel);
      if (playlist != null) {
        playlists.add(playlist);
      }
    }

    return playlists;
  }
}

