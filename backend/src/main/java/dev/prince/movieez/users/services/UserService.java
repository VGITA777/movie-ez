package dev.prince.movieez.users.services;

import dev.prince.movieez.exceptions.UserNotFoundException;
import dev.prince.movieez.security.models.UserModel;
import dev.prince.movieez.security.repositories.UserRepository;
import jakarta.transaction.Transactional;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Transactional
@Service
public class UserService {

  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public UserModel save(UserModel userModel) {
    return userRepository.save(userModel);
  }

  public UserModel find(UUID id) {
    return userRepository
        .findById(id)
        .orElseThrow(() -> new UserNotFoundException("User not found"));
  }

  public void delete(UUID id) {
    userRepository.deleteById(id);
  }
}
