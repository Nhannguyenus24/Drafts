package chatbot.infrastructure.persistence;

import chatbot.domain.entity.User;
import chatbot.domain.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcUserRepository implements UserRepository {

    private static final Logger logger = LoggerFactory.getLogger(JdbcUserRepository.class);

    private final JdbcTemplate jdbcTemplate;

    public JdbcUserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<User> userRowMapper = (rs, rowNum) -> new User(
            rs.getInt("id"),
            rs.getString("name"),
            rs.getString("email"),
            rs.getString("password")
    );

    @Override
    public Optional<User> findById(Integer id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        try {
            List<User> users = jdbcTemplate.query(sql, userRowMapper, id);
            return users.stream().findFirst();
        } catch (DataAccessException e) {
            logger.error("Error finding user by ID {}: {}", id, e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        try {
            List<User> users = jdbcTemplate.query(sql, userRowMapper, email);
            return users.stream().findFirst();
        } catch (DataAccessException e) {
            logger.error("Error finding user by email {}: {}", email, e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public List<User> findAll() {
        String sql = "SELECT * FROM users";
        try {
            return jdbcTemplate.query(sql, userRowMapper);
        } catch (DataAccessException e) {
            logger.error("Error fetching all users: {}", e.getMessage());
            return List.of();
        }
    }

    @Override
    public Integer save(User user) {
        String sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        try {
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, user.getName());
                ps.setString(2, user.getEmail());
                ps.setString(3, user.getPassword());
                return ps;
            }, keyHolder);

            if (keyHolder.getKey() != null) {
                int generatedId = keyHolder.getKey().intValue();
                user.setId(generatedId);
                logger.info("Saved user with id {}: {}", generatedId, user);
                return generatedId;
            }
        } catch (DataAccessException e) {
            logger.error("Error saving user {}: {}", user, e.getMessage());
        }

        return null;
    }


    @Override
    public void deleteById(Integer id) {
        String sql = "DELETE FROM users WHERE id = ?";
        try {
            jdbcTemplate.update(sql, Integer.valueOf(id));
            logger.info(id.toString());
        } catch (DataAccessException e) {
            logger.error("Error deleting user by ID {}: {}", id, e.getMessage());
        }
    }
}
