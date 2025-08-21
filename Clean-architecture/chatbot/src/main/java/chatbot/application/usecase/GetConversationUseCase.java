package chatbot.application.usecase;

import chatbot.domain.entity.Message;
import chatbot.domain.repository.ConversationRepository;
import chatbot.domain.entity.Conversation;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetConversationUseCase {

    private final ConversationRepository conversationService;

    public GetConversationUseCase(ConversationRepository conversationService) {
        this.conversationService = conversationService;
    }

    public GetConversationResult execute(Integer conversationId) {
        try {
            List<Message> messages= conversationService.getMessages(conversationId);
            return new GetConversationResult(true, "Get message successfully", messages);
        } catch (Exception e) {
            return new GetConversationResult(false, "Error: " + e.getMessage(), null);
        }
    }

    public static class GetConversationResult {
        private final boolean success;
        private final String message;
        private final List<Message> conversation;

        public GetConversationResult(boolean success, String message, List<Message> conversation) {
            this.success = success;
            this.message = message;
            this.conversation = conversation;
        }

        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public List<Message> getConversation() { return conversation; }
    }
}
