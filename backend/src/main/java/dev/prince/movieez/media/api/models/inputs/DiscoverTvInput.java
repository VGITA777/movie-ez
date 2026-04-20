package dev.prince.movieez.media.api.models.inputs;

import dev.prince.movieez.media.api.models.enums.Language;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiscoverTvInput {

  @Builder.Default
  private boolean includeAdult = true;

  @Builder.Default
  private Language language = Language.ENGLISH;

  @Min(value = 1, message = "{constraint.Page.message}")
  @Builder.Default
  private int page = 1;

  private Integer firstAirDateYear;
}

