package dev.prince.movieez.media.models.inputs;

import dev.prince.movieez.media.models.enums.Language;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class TvSeasonDetailsInput {

  @NotNull(message = "{constraint.invalid.null-value.msg}")
  private long seriesId;

  @Min(value = 1, message = "{constraint.invalid.season.msg}")
  private int seasonNumber;

  @Builder.Default
  private Language language = Language.ENGLISH;

}
