package dev.prince.movieez.media.api.converters;

import dev.prince.movieez.media.api.models.enums.Country;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StringToCountryConverter implements Converter<String, Country> {

  @Override
  public Country convert(String source) {
    return Country.fromValue(source);
  }
}
