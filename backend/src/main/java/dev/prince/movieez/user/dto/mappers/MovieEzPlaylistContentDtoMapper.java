package dev.prince.movieez.user.dto.mappers;

import dev.prince.movieez.user.configs.SpringDtoMapperConfigs;
import dev.prince.movieez.user.dto.MovieEzPlaylistContentDto;
import dev.prince.movieez.user.models.MovieEzPlaylistContentModel;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(config = SpringDtoMapperConfigs.class)
public interface MovieEzPlaylistContentDtoMapper {

  @BeanMapping(unmappedTargetPolicy = ReportingPolicy.IGNORE)
  @Mapping(source = "id", target = "id")
  @Mapping(source = "playlist.id", target = "playlist")
  @Mapping(source = "trackId", target = "trackId")
  MovieEzPlaylistContentDto toDto(MovieEzPlaylistContentModel model);

  @BeanMapping(unmappedTargetPolicy = ReportingPolicy.IGNORE)
  @Mapping(source = "id", target = "id")
  @Mapping(source = "playlist", target = "playlist.id")
  @Mapping(source = "trackId", target = "trackId")
  MovieEzPlaylistContentModel toModel(MovieEzPlaylistContentDto dto);
}
