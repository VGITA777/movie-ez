package dev.prince.movieez.media.json.deserializers;

import dev.prince.movieez.media.models.enums.MediaType;
import tools.jackson.core.JacksonException;
import tools.jackson.core.JsonParser;
import tools.jackson.databind.DeserializationContext;
import tools.jackson.databind.ValueDeserializer;

public class StringToMediaTypeDeserializer extends ValueDeserializer<MediaType> {

  @Override
  public MediaType deserialize(JsonParser p, DeserializationContext ctxt) throws JacksonException {
    var value = p
        .getString()
        .toLowerCase()
        .trim();
    return MediaType.fromValue(value);
  }
}
