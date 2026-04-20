package dev.prince.movieez.user.controllers;

import dev.prince.movieez.shared.models.ErrorModel;
import dev.prince.movieez.shared.models.responses.ServerErrorResponse;
import dev.prince.movieez.user.exceptions.MalformedEmailException;
import dev.prince.movieez.user.exceptions.MalformedInput;
import dev.prince.movieez.user.exceptions.MalformedPasswordException;
import dev.prince.movieez.user.exceptions.NotFoundException;
import dev.prince.movieez.user.exceptions.ResourceAlreadyExistsException;
import dev.prince.movieez.user.exceptions.UserNotFoundException;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import jakarta.validation.ConstraintViolationException;
import java.sql.SQLException;
import java.util.List;
import javax.security.auth.login.CredentialException;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.ott.InvalidOneTimeTokenException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@ControllerAdvice
public class UserControllerAdvice {

  private final MessageSource messageSource;

  public UserControllerAdvice(MessageSource messageSource) {
    this.messageSource = messageSource;
  }

  @ExceptionHandler(UsernameNotFoundException.class)
  public ResponseEntity<?> handleUsernameNotFoundException(UsernameNotFoundException e) {
    String title = msg("auth.userNotFound.title", "User Not Found");
    String base = msg("auth.userNotFound.message", "No matching user account found.");
    String message = appendDetail(base, e.getMessage());
    return createErrorResponse(title, message, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<?> handleBadCredentialsException(BadCredentialsException e) {
    String title = msg("auth.badCredentials.title", "Invalid Credentials");
    String base = msg("auth.badCredentials.message", "The username or password is incorrect.");
    String message = appendDetail(base, e.getMessage());
    return createErrorResponse(title, message, HttpStatus.UNAUTHORIZED);
  }

  @ExceptionHandler(CredentialException.class)
  public ResponseEntity<?> handleCredentialException(CredentialException e) {
    String title = msg("auth.credentialFailure.title", "Authentication Failed");
    String base = msg("auth.credentialFailure.message", "Authentication could not be completed.");
    String message = appendDetail(base, e.getMessage());
    return createErrorResponse(title, message, HttpStatus.UNAUTHORIZED);
  }

  @ExceptionHandler(MalformedEmailException.class)
  public ResponseEntity<?> handleMalformedEmailException(MalformedEmailException e) {
    String title = msg("auth.invalidEmail.title", "Invalid Email");
    String base = msg("auth.invalidEmail.message", "Provided email is not valid.");
    String message = appendDetail(base, e.getMessage());
    return createErrorResponse(title, message, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(MalformedPasswordException.class)
  public ResponseEntity<?> handleMalformedPasswordException(MalformedPasswordException e) {
    String title = msg("auth.invalidPassword.title", "Invalid Password");
    String base = msg("auth.invalidPassword.message", "Password does not meet the required format.");
    String message = appendDetail(base, e.getMessage());
    return createErrorResponse(title, message, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<?> handleUserNotFoundException(UserNotFoundException e) {
    String title = msg("auth.userNotFound.title", "User Not Found");
    String base = msg("auth.userNotFound.message", "No matching user account found.");
    String message = appendDetail(base, e.getMessage());
    return createErrorResponse(title, message, HttpStatus.NOT_FOUND);
  }

  /**
   * Handles illegal argument exceptions.
   */
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<?> handleIllegalArgumentException(IllegalArgumentException e) {
    String title = msg("error.invalidInput.title", "Invalid Input");
    String base = msg("error.invalidInput.message", "Request contains invalid parameters.");
    String message = appendDetail(base, e.getMessage());
    return createErrorResponse(title, message, HttpStatus.BAD_REQUEST);
  }


  /* BASE CLASS EXCEPTION HANDLERS */

  /**
   * Handles InvalidOneTimeTokenException from Spring Security OTT flow.
   */
  @ExceptionHandler(InvalidOneTimeTokenException.class)
  public ResponseEntity<?> handleInvalidOneTimeTokenException(InvalidOneTimeTokenException e) {
    String title = msg("auth.ott.invalid.title", "Invalid One-Time Token");
    String base = msg("auth.ott.invalid.message", "The one-time token provided is invalid or expired.");
    String message = appendDetail(base, e.getMessage());
    return createErrorResponse(title, message, HttpStatus.UNAUTHORIZED);
  }

  /**
   * Handles SQLException thrown by Spring Data JPA.
   */
  @ExceptionHandler({ DataIntegrityViolationException.class, SQLException.class })
  public ResponseEntity<?> handleSQLException(SQLException e) {
    String detail = e.getMessage();
    String message = detail != null ? detail : "Database error";
    if (message.contains("Duplicate entry")) {
      String title = msg("sql.duplicate.title", "Conflict");
      String base = msg("sql.duplicate.message", "An entry with the same key already exists.");
      String body = base;
      if (!detail.contains("for key")) {
        body = appendDetail(base, detail);
      }
      return createErrorResponse(title, body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    String title = msg("sql.error.title", "Database Error");
    String base = msg("sql.error.message", "An unexpected database error occurred.");
    String body = appendDetail(base, detail);
    return createErrorResponse(title, body, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  /**
   * Handles MethodArgumentNotValidException thrown by Spring validation.
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<?> handleMethodArgumentNotValid(MethodArgumentNotValidException e) {
    List<ErrorModel> errors = e
        .getBindingResult()
        .getAllErrors()
        .stream()
        .map(DefaultMessageSourceResolvable::getDefaultMessage)
        .filter(message -> message != null && !message.isBlank())
        .distinct()
        .map(ErrorModel::new)
        .toList();
    String title = msg("validation.invalid.title", "Invalid Input");
    return createErrorResponse(title, errors, HttpStatus.BAD_REQUEST);
  }

  private ResponseEntity<ServerErrorResponse> createErrorResponse(
      String title,
      List<ErrorModel> errors,
      HttpStatus status
  ) {
    var response = new ServerErrorResponse(title, errors);
    return ResponseEntity
        .status(status)
        .body(response);
  }

  /**
   * Handles RequestNotPermitted thrown by Resilience4j.
   */
  @ExceptionHandler(RequestNotPermitted.class)
  public ResponseEntity<?> handleRequestNotPermitted(RequestNotPermitted e) {
    String title = msg("rateLimit.exceeded.title", "Rate Limit Exceeded");
    String base = msg("rateLimit.exceeded.message", "You have exceeded the rate limit for this endpoint.");
    String message = appendDetail(base, e.getMessage());
    return createErrorResponse(title, message, HttpStatus.TOO_MANY_REQUESTS);
  }

  @ExceptionHandler({ NoResourceFoundException.class, NotFoundException.class })
  public ResponseEntity<?> handleNotFoundException(Exception e) {
    String title = msg("resource.notFound.title", "Resource Error");
    String base = msg("resource.notFound.message", "Requested resource not found.");
    String message = appendDetail(base, e.getMessage());
    return createErrorResponse(title, message, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(MalformedInput.class)
  public ResponseEntity<?> handleMalformedInput(MalformedInput e) {
    String title = msg("input.malformed.title", "Malformed Input");
    String base = msg("input.malformed.message", "Request contains malformed input.");
    String message = appendDetail(base, e.getMessage());
    return createErrorResponse(title, message, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(ResourceAlreadyExistsException.class)
  public ResponseEntity<?> handleResourceAlreadyExistsException(ResourceAlreadyExistsException e) {
    String title = msg("resource.alreadyExists.title", "Resource Already Exists");
    String base = msg("resource.alreadyExists.message", "Requested resource already exists.");
    String message = appendDetail(base, e.getMessage());
    return createErrorResponse(title, message, HttpStatus.CONFLICT);
  }

  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  public ResponseEntity<?> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e) {
    String title = msg("error.invalidInput.title", "Invalid Input");
    String base = msg("error.invalidInput.message", "Request contains invalid parameters.");
    String message = appendDetail(base, e.getMessage());
    return createErrorResponse(title, message, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler({ ConstraintViolationException.class, HandlerMethodValidationException.class })
  public ResponseEntity<?> handleConstraintViolationException(ConstraintViolationException e) {
    String title = msg("validation.invalid.title", "Invalid Input");
    return createErrorResponse(title, e.getMessage(), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<?> handleException(Exception e) {
    String title = msg("error.internal.unknown.title", "Internal Server Error");
    String base = msg("error.internal.unknown.message", "An unexpected error occurred.");
    String message = appendDetail(base, e.getMessage());
    return createErrorResponse(title, message, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  private String msg(String key, String defaultMessage) {
    return msg(key, defaultMessage, new Object[]{});
  }

  private String appendDetail(String base, String detail) {
    if (detail == null || detail.isBlank()) {
      return base;
    }
    String trimmed = detail.trim();
    // avoid duplicating detail if already included
    if (base.endsWith(trimmed) || base.contains("(" + trimmed + ")")) {
      return base;
    }
    return base + " (" + trimmed + ")";
  }

  private ResponseEntity<ServerErrorResponse> createErrorResponse(String title, String message, HttpStatus status) {
    var error = new ErrorModel(message);
    var response = new ServerErrorResponse(title, error);
    return ResponseEntity
        .status(status)
        .body(response);
  }

  private String msg(String key, String defaultMessage, Object... args) {
    return messageSource.getMessage(key, args, defaultMessage, LocaleContextHolder.getLocale());
  }
}
