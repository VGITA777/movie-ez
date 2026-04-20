package dev.prince.movieez.user.validators;

import dev.prince.movieez.user.validators.annotations.Username;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;


public class UsernameValidator implements ConstraintValidator<Username, String> {

  private static final String ALPHANUMERIC_REGEX = "^[a-zA-Z0-9_]+$";
  private int minLength;
  private int maxLength;

  @Override
  public void initialize(Username constraintAnnotation) {
    this.maxLength = constraintAnnotation.maxLength();
    this.minLength = constraintAnnotation.minLength();
  }


  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {
    return value.matches(ALPHANUMERIC_REGEX) && value.length() >= minLength && value.length() <= maxLength;
  }
}
