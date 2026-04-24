package dev.prince.movieez.media.json.serializers;

import dev.prince.movieez.media.models.enums.MediaType;
import tools.jackson.core.JacksonException;
import tools.jackson.core.JsonGenerator;
import tools.jackson.databind.SerializationContext;
import tools.jackson.databind.ValueSerializer;

public class MediaTypeToStringSerializer extends ValueSerializer<MediaType> {

  @Override
  public void serialize(MediaType value, JsonGenerator gen, SerializationContext ctxt) throws JacksonException {
    var mediaType = value.toString();
    gen.writeString(mediaType);
  }
}
