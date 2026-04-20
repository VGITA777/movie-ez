package dev.prince.movieez.user.validators;

import dev.prince.movieez.user.validators.annotations.Required;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Objects;

public class RequiredValidator implements ConstraintValidator<Required, Object> {

  @Override
  public boolean isValid(Object value, ConstraintValidatorContext context) {
    if (value instanceof String s) {
      return !s.isBlank();
    }
    return !Objects.equals(value, null);
  }
}
