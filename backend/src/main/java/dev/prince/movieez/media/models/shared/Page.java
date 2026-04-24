package dev.prince.movieez.media.models.shared;

import java.util.List;
import lombok.Data;

/**
 * Generic model for paginated results in The Movie Database (TMDB) API. Contains information about the current page,
 * total pages, total results, and the results themselves.
 *
 * @param <T> The type of objects in the results list
 *
 * @see <a href="https://developer.themoviedb.org/reference/intro/pagination">TMDB Pagination Documentation</a>
 */
@Data
public class Page<T> {

  private int page;
  private int total_pages;
  private int total_results;
  private List<T> results;
}
