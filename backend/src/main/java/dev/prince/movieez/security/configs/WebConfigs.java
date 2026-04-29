package dev.prince.movieez.security.configs;

import java.time.Duration;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.mvc.WebContentInterceptor;

@Configuration
public class WebConfigs implements WebMvcConfigurer {

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    var webContentInterceptor = new WebContentInterceptor();
    configureMediaEndpointCache(webContentInterceptor);
    registry.addInterceptor(webContentInterceptor);
  }

  private void configureMediaEndpointCache(WebContentInterceptor webContentInterceptor) {
    var control = CacheControl
        .maxAge(Duration.ofMinutes(5))
        .mustRevalidate();
    webContentInterceptor.addCacheMapping(control, "/media/**");
  }
}
