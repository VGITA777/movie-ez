package dev.prince.movieez.users.services;

import dev.prince.movieez.security.repositories.PlaylistRepository;
import jakarta.transaction.Transactional;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class PlaylistTombstoneCleanupService {

  private final PlaylistRepository playlistRepository;

  private final int retentionDays;

  public PlaylistTombstoneCleanupService(
      PlaylistRepository playlistRepository,
      @Value("${app.playlists.tombstone-retention-days:30}")
      int retentionDays
  ) {
    this.playlistRepository = playlistRepository;
    this.retentionDays = retentionDays;
  }

  /*
   * Runs every day at 3:00 AM server time.
   *
   * Tombstones are kept for 30 days so offline devices still have time
   * to receive deletion records during sync.
   */
  @Scheduled(cron = "0 0 3 * * *")
  @Transactional
  public void cleanupOldPlaylistTombstones() {
    var cutoff = Instant
        .now()
        .minus(retentionDays, ChronoUnit.DAYS);

    long deletedCount = playlistRepository.deleteByDeletedOnIsNotNullAndDeletedOnBefore(cutoff);

    if (deletedCount > 0) {
      log.info(
          "Deleted a total of {} playlist tombstones that were marked for deletion before {}",
          deletedCount,
          cutoff
      );
    }
  }
}