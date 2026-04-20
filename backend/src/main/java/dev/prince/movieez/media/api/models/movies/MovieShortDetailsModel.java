package dev.prince.movieez.media.api.models.movies;

import dev.prince.movieez.media.api.models.shared.MediaShortDetailsModel;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class MovieShortDetailsModel extends MediaShortDetailsModel {

  private boolean adult;
  private String title;
  private String original_title;
  private String release_date;
  private boolean video;
}
