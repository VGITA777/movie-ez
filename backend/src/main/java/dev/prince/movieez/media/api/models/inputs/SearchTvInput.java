package dev.prince.movieez.media.api.models.inputs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class SearchTvInput extends SearchMultiInput {

  private int firstAirDateYear;
}
