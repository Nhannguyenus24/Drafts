package chatbot.domain.repository;

import chatbot.domain.entity.User;
import java.util.Optional;
import java.util.List;

public interface UserRepository {
    Optional<User> findById(Integer id);
    Optional<User> findByEmail(String email);
    List<User> findAll();
    Integer save(User user);
    void deleteById(Integer id);
}
