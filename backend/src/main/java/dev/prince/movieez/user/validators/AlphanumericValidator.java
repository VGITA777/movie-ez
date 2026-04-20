package dev.prince.movieez.user.validators;

import dev.prince.movieez.user.validators.annotations.Alphanumeric;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class AlphanumericValidator implements ConstraintValidator<Alphanumeric, String> {

  private static final String UNICODE_ALNUM_SINGLE_INTERNAL_SPACES = "^[\\p{L}\\p{N}]+(?: [\\p{L}\\p{N}]+)*$";

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {
    return value != null && value.matches(UNICODE_ALNUM_SINGLE_INTERNAL_SPACES);
  }
}
