package dev.prince.movieez.media.converters;

import dev.prince.movieez.media.models.enums.Language;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StringToLanguageConverter implements Converter<String, Language> {

  @Override
  public Language convert(String source) {
    return Language.fromValue(source);
  }
}
