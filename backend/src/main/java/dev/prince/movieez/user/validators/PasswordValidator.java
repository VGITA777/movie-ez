package dev.prince.movieez.user.validators;

import dev.prince.movieez.user.validators.annotations.Password;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidator implements ConstraintValidator<Password, String> {

  // At least one digit, one letter, and one special character
  private static final String VALID_PASSWORD_REGEX = "^(?=.*[0-9])(?=.*[A-Za-z])(?=.*[!@#$%^&*(),.?\":{}|<>])[A-Za-z0-9!@#$%^&*(),.?\":{}|<>]+$";
  private int minLength;
  private int maxLength;

  @Override
  public void initialize(Password constraintAnnotation) {
    this.maxLength = constraintAnnotation.maxLength();
    this.minLength = constraintAnnotation.minLength();
  }

  @Override
  public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
    return s != null && s.length() >= minLength && s.length() <= maxLength && s.matches(VALID_PASSWORD_REGEX);
  }
}
