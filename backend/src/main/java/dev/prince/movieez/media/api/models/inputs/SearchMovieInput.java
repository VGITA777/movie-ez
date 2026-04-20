package dev.prince.movieez.media.api.models.inputs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class SearchMovieInput extends SearchMultiInput {

  private int primaryReleaseYear;
  private String region;
  private int year;
}
