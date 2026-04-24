package dev.prince.movieez.media.models.shared;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Keywords {

  private long id;
  private List<Keyword> keywords;
}
