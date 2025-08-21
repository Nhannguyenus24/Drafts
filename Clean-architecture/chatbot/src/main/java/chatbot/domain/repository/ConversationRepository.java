package chatbot.domain.repository;

import chatbot.domain.entity.Conversation;
import chatbot.domain.entity.Message;
import java.util.Optional;
import java.util.List;

public interface ConversationRepository {
    Conversation findById(Integer id);
    List<Conversation> findByUserId(Integer userId);
    void save(Conversation conversation);

    List<Message> getMessages(Integer conversationId);
    void addMessage(Integer conversationId, Message message);

    void renameConversation(Integer conversationId, String newName);
}

