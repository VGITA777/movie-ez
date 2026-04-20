package dev.prince.movieez.user.validators;

import dev.prince.movieez.user.validators.annotations.ListRegexMatch;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.List;

public class ListRegexMatchValidator implements ConstraintValidator<ListRegexMatch, List<String>> {

  String[] regex;

  boolean matchAll;

  @Override
  public void initialize(ListRegexMatch constraintAnnotation) {
    this.regex = constraintAnnotation.patterns();
    this.matchAll = constraintAnnotation.matchAll();
  }

  @Override
  public boolean isValid(List<String> value, ConstraintValidatorContext context) {
    if (value == null) {
      return false;
    }
    if (value.isEmpty() || regex.length == 0) {
      return true;
    }

    for (String s : value) {
      for (String r : regex) {
        if (s.matches(r) && !matchAll) {
          return true;
        }
        if (!s.matches(r) && matchAll) {
          return false;
        }
      }
    }

    return true;
  }
}
