package chatbot.infrastructure.persistence;

import chatbot.domain.entity.Conversation;
import chatbot.domain.entity.Message;
import chatbot.domain.repository.ConversationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.sql.PreparedStatement;
import java.sql.Statement;

@Repository
public class JdbcConversationRepository implements ConversationRepository {

    private static final Logger logger = LoggerFactory.getLogger(JdbcConversationRepository.class);

    private final JdbcTemplate jdbcTemplate;

    public JdbcConversationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Conversation> conversationRowMapper = (rs, rowNum) -> new Conversation(
            rs.getInt("id"),
            rs.getString("name"),
            rs.getInt("user_id"),
            rs.getTimestamp("created_at").toLocalDateTime()
    );

    private final RowMapper<Message> messageRowMapper = (rs, rowNum) -> new Message(
            rs.getInt("id"),
            rs.getString("content"),
            rs.getTimestamp("timestamp").toLocalDateTime(),
            rs.getBoolean("is_user")
    );

    @Override
    public Conversation findById(Integer id) {
        String sql = "SELECT * FROM conversations WHERE id = ?";
        try {
            List<Conversation> result = jdbcTemplate.query(sql, conversationRowMapper, id);
            return result.stream().findFirst().orElse(null);
        } catch (DataAccessException e) {
            logger.error("Error finding conversation by ID {}: {}", id, e.getMessage());
            return null;
        }
    }

    @Override
    public List<Conversation> findByUserId(Integer userId) {
        String sql = "SELECT * FROM conversations WHERE user_id = ?";
        try {
            return jdbcTemplate.query(sql, conversationRowMapper, userId);
        } catch (DataAccessException e) {
            logger.error("Error finding conversations for user ID {}: {}", userId, e.getMessage());
            return List.of(); // Return empty list as fallback
        }
    }

    @Override
    public void save(Conversation conversation) {
        String sql = "INSERT INTO conversations (name, user_id, created_at) VALUES (?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        try {
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, conversation.getName());
                ps.setInt(2, conversation.getUserId());
                ps.setTimestamp(3, Timestamp.valueOf(conversation.getDateTime()));
                return ps;
            }, keyHolder);

            Map<String, Object> keys = keyHolder.getKeys();
            if (keys != null && keys.get("id") != null) {
                conversation.setId(((Number) keys.get("id")).intValue());
            }

        } catch (DataAccessException e) {
            logger.error("Error saving conversation {}: {}", conversation, e.getMessage());
        }
    }

    @Override
    public List<Message> getMessages(Integer conversationId) {
        if (findById(conversationId) == null) {
            logger.warn("Conversation ID {} not found.", conversationId);
            return null;
        }
        String sql = "SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC";
        try {
            return jdbcTemplate.query(sql, messageRowMapper, conversationId);
        } catch (DataAccessException e) {
            logger.error("Error getting messages for conversation ID {}: {}", conversationId, e.getMessage());
            return List.of();
        }
    }

    @Override
    public void addMessage(Integer conversationId, Message message) {
        String sql = "INSERT INTO messages ( content, timestamp, is_user, conversation_id) VALUES (?, ?, ?, ?)";
        try {
            jdbcTemplate.update(sql, message.getContent(),
                    Timestamp.valueOf(message.getTimestamp()), message.getIsUser(), conversationId);
        } catch (DataAccessException e) {
            logger.error("Error adding message to conversation ID {}: {}", conversationId, e.getMessage());
        }
    }

    @Override
    public void renameConversation(Integer conversationId, String newName) {
        String sql = "UPDATE conversations SET name = ? WHERE id = ?";
        try {
            jdbcTemplate.update(sql, newName, conversationId);
        } catch (DataAccessException e) {
            logger.error("Error renaming conversation ID {}: {}", conversationId, e.getMessage());
        }
    }
}