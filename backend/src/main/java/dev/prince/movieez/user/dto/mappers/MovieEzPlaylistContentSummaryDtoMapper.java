package dev.prince.movieez.user.dto.mappers;

import dev.prince.movieez.user.configs.SpringDtoMapperConfigs;
import dev.prince.movieez.user.dto.MovieEzPlaylistContentSummaryDto;
import dev.prince.movieez.user.models.MovieEzPlaylistContentModel;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(config = SpringDtoMapperConfigs.class)
public interface MovieEzPlaylistContentSummaryDtoMapper {

  @BeanMapping(unmappedTargetPolicy = ReportingPolicy.IGNORE)
  @Mapping(source = "id", target = "id")
  @Mapping(source = "trackId", target = "trackId")
  MovieEzPlaylistContentSummaryDto toDto(MovieEzPlaylistContentModel model);
}
