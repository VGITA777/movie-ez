package dev.prince.movieez.security.keycloak;

import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class KeycloakMovieEzAdminProvider {

  private final Keycloak keycloak;

  public KeycloakMovieEzAdminProvider(
      KeycloakAdminConfigurationProperties properties
  ) {
    this.keycloak = KeycloakBuilder
        .builder()
        .clientId(properties.getClientId())
        .grantType("client_credentials")
        .clientSecret(properties.getSecret())
        .serverUrl(properties.getServerUrl())
        .realm(properties.getRealm())
        .build();
  }

  @Bean(name = "movieEzAdminClient")
  public Keycloak getKeycloak() {
    return keycloak;
  }

  @PreDestroy
  public void close() {
    log.info("Closing Keycloak connection");
    if (keycloak != null) {
      keycloak.close();
    }
  }
}
