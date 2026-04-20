package dev.prince.movieez.user.validators.annotations;

import dev.prince.movieez.user.validators.UsernameValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * A validator that ensures a username is valid.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.FIELD })
@Constraint(validatedBy = { UsernameValidator.class })
public @interface Username {

  String message() default "{constraint.Username.message}";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};

  int minLength() default 4;

  int maxLength() default 32;
}
