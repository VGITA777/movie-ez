package dev.prince.movieez.user.dto.mappers;

import dev.prince.movieez.user.configs.SpringDtoMapperConfigs;
import dev.prince.movieez.user.dto.MovieEzUserPlaylistSummaryDto;
import dev.prince.movieez.user.models.MovieEzUserPlaylistModel;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(config = SpringDtoMapperConfigs.class)
public interface MovieEzUserPlaylistSummaryDtoMapper {

  @BeanMapping(unmappedTargetPolicy = ReportingPolicy.IGNORE)
  @Mapping(source = "id", target = "id")
  @Mapping(source = "name", target = "name")
  MovieEzUserPlaylistSummaryDto toDto(MovieEzUserPlaylistModel model);

  @BeanMapping(unmappedTargetPolicy = ReportingPolicy.IGNORE)
  @Mapping(source = "id", target = "id")
  @Mapping(source = "name", target = "name")
  MovieEzUserPlaylistModel toModel(MovieEzUserPlaylistSummaryDto dto);
}
