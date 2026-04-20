package dev.prince.movieez.user.validators.annotations;

import dev.prince.movieez.user.validators.RequiredValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * A validator that ensures a field has value (not null).
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.FIELD })
@Constraint(validatedBy = { RequiredValidator.class })
public @interface Required {

  String fieldName() default "";

  String message() default "{constraint.Required.message}";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}
