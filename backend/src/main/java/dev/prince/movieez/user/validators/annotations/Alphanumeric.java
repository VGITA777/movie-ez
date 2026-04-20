package dev.prince.movieez.user.validators.annotations;

import dev.prince.movieez.user.validators.AlphanumericValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * A validator that ensures a field is alphanumeric.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Constraint(validatedBy = { AlphanumericValidator.class })
public @interface Alphanumeric {

  String message() default "{constraint.Alphanumeric.message}";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}
