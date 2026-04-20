package dev.prince.movieez.user.validators.annotations;

import dev.prince.movieez.user.validators.ListRegexMatchValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * A validator that matches the regex patterns. Can be set to match all the patterns or just one.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Constraint(validatedBy = { ListRegexMatchValidator.class })
public @interface ListRegexMatch {

  String message() default "{constraint.ListRegexMatch.message}";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};

  String[] patterns() default {};

  boolean matchAll() default false;
}
