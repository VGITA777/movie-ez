package dev.prince.movieez.media.models.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Arrays;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.Getter;

@Getter
public enum MediaType {
  MOVIE("movie"), TV("tv"), PERSON("person");

  public static final Map<String, MediaType> MEDIA_TYPE_MAP = Arrays
      .stream(MediaType.values())
      .collect(Collectors.toMap(MediaType::getType, type -> type));

  private final String type;

  MediaType(String type) {
    this.type = type;
  }

  /*
   * Accepts both:
   * - "movie", "tv", "person" from TMDB/frontend
   * - "MOVIE", "TV", "PERSON" from Java-style payloads
   */
  @JsonCreator
  public static MediaType fromValue(String value) {
    if (value == null || value.isBlank()) {
      return null;
    }

    var normalized = value.trim();

    var byTmdbType = MEDIA_TYPE_MAP.get(normalized.toLowerCase(Locale.ROOT));
    if (byTmdbType != null) {
      return byTmdbType;
    }

    try {
      return MediaType.valueOf(normalized.toUpperCase(Locale.ROOT));
    } catch (IllegalArgumentException ex) {
      return null;
    }
  }

  @JsonValue
  public String getType() {
    return type;
  }
}