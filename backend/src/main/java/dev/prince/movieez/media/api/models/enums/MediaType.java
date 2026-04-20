package dev.prince.movieez.media.api.models.enums;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.Getter;

@Getter
public enum MediaType {
  MOVIE("movie"), TV("tv"), PERSON("person");

  public static final Map<String, MediaType> MEDIA_TYPE_MAP = Arrays.stream(MediaType.values())
                                                                    .collect(Collectors.toMap(
                                                                        MediaType::getType,
                                                                        type -> type
                                                                    ));
  private final String type;

  MediaType(String type) {
    this.type = type;
  }

  public static MediaType fromValue(String type) {
    return MEDIA_TYPE_MAP.getOrDefault(type, null);
  }

}
