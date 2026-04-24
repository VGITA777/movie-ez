package dev.prince.movieez;

import java.time.Duration;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;

public class ResponseEntityUtils {

  public static ResponseEntity.BodyBuilder okPrivateOneDay() {
    return okPrivateWithCacheControl(Duration.ofDays(1));
  }

  public static ResponseEntity.BodyBuilder okPrivateWithCacheControl(Duration duration) {
    return ResponseEntity
        .ok()
        .cacheControl(CacheControl
                          .maxAge(duration)
                          .cachePrivate()
                          .mustRevalidate());
  }

  public static ResponseEntity.BodyBuilder okPrivateOneWeek() {
    return okPrivateWithCacheControl(Duration.ofDays(7));
  }
}

