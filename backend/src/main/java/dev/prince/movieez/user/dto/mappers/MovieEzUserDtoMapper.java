package dev.prince.movieez.user.dto.mappers;

import dev.prince.movieez.user.configs.SpringDtoMapperConfigs;
import dev.prince.movieez.user.dto.MovieEzUserDto;
import dev.prince.movieez.user.models.MovieEzUserModel;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(
    config = SpringDtoMapperConfigs.class, uses = { MovieEzUserPlaylistSummaryDtoMapper.class }
)
public interface MovieEzUserDtoMapper {

  @BeanMapping(unmappedTargetPolicy = ReportingPolicy.IGNORE)
  @Mapping(source = "id", target = "id")
  @Mapping(source = "username", target = "username")
  @Mapping(source = "email", target = "email")
  @Mapping(source = "playlists", target = "playlists")
  MovieEzUserDto toDto(MovieEzUserModel model);

  @BeanMapping(unmappedTargetPolicy = ReportingPolicy.IGNORE)
  @Mapping(source = "id", target = "id")
  @Mapping(source = "username", target = "username")
  @Mapping(source = "email", target = "email")
  @Mapping(source = "playlists", target = "playlists")
  MovieEzUserModel toModel(MovieEzUserDto dto);
}
