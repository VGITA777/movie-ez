package dev.prince.movieez.media.api.json.serailizers;

import dev.prince.movieez.media.api.models.enums.MediaType;
import lombok.NonNull;
import tools.jackson.core.JacksonException;
import tools.jackson.core.JsonGenerator;
import tools.jackson.databind.SerializationContext;
import tools.jackson.databind.ValueSerializer;

public class MediaTypeToStringSerializer extends ValueSerializer<MediaType> {

  @Override
  public void serialize(
      @NonNull
      MediaType value, JsonGenerator gen, SerializationContext ctxt
  ) throws JacksonException {
    gen.writeString(value.toString());
  }
}
