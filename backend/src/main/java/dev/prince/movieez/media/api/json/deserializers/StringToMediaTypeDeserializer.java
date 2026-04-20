package dev.prince.movieez.media.api.json.deserializers;

import dev.prince.movieez.media.api.models.enums.MediaType;
import lombok.NonNull;
import tools.jackson.core.JacksonException;
import tools.jackson.core.JsonParser;
import tools.jackson.databind.DeserializationContext;
import tools.jackson.databind.ValueDeserializer;

public class StringToMediaTypeDeserializer extends ValueDeserializer<@NonNull MediaType> {

  @Override
  public @NonNull MediaType deserialize(JsonParser p, DeserializationContext ctxt) throws JacksonException {
    return MediaType.fromValue(p
                                   .getString()
                                   .trim()
                                   .toLowerCase());
  }
}
