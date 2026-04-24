package dev.prince.movieez;

import dev.prince.movieez.media.properties.TMDBSettings;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@EnableConfigurationProperties({ TMDBSettings.class })
@SpringBootApplication
public class MovieEzApplication {

  static void main(String[] args) {
    SpringApplication.run(MovieEzApplication.class, args);
  }

}
