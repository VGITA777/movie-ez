package dev.prince.movieez.shared.utilities;

import jakarta.servlet.http.HttpServletResponse;
import lombok.SneakyThrows;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.json.JsonMapper;

@Service
public class BasicUtils {

  private final ObjectMapper OBJECT_MAPPER = JsonMapper.shared();

  @SneakyThrows
  public void sendJson(HttpStatus status, Object message, HttpServletResponse response) {
    response.setStatus(status.value());
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    response
        .getWriter()
        .write(OBJECT_MAPPER.writeValueAsString(message));
  }
}
