package dev.prince.movieez.user.dto.mappers;

import dev.prince.movieez.user.configs.SpringDtoMapperConfigs;
import dev.prince.movieez.user.dto.MovieEzUserPlaylistDto;
import dev.prince.movieez.user.models.MovieEzUserPlaylistModel;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(config = SpringDtoMapperConfigs.class, uses = { MovieEzPlaylistContentSummaryDtoMapper.class })
public interface MovieEzUserPlaylistDtoMapper {

  @BeanMapping(unmappedTargetPolicy = ReportingPolicy.IGNORE)
  @Mapping(source = "id", target = "id")
  @Mapping(source = "user.id", target = "user")
  @Mapping(source = "name", target = "name")
  @Mapping(source = "contents", target = "contents")
  MovieEzUserPlaylistDto toDto(MovieEzUserPlaylistModel model);

  @BeanMapping(unmappedTargetPolicy = ReportingPolicy.IGNORE)
  @Mapping(source = "id", target = "id")
  @Mapping(source = "user", target = "user.id")
  @Mapping(source = "name", target = "name")
  @Mapping(source = "contents", target = "contents")
  MovieEzUserPlaylistModel toModel(MovieEzUserPlaylistDto dto);
}
