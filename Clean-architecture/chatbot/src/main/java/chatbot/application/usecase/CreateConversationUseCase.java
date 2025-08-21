package chatbot.application.usecase;

import chatbot.application.service.JwtEncodedService;
import chatbot.domain.repository.ConversationRepository;
import chatbot.domain.entity.Conversation;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class CreateConversationUseCase {

    private final ConversationRepository conversationService;
    private final JwtEncodedService jwtEncodedService;

    public CreateConversationUseCase(ConversationRepository conversationService, JwtEncodedService jwtEncodedService) {
        this.conversationService = conversationService;
        this.jwtEncodedService = jwtEncodedService;
    }

    public CreateConversationResult execute(String token, String name) {
        try {
            Integer userId = jwtEncodedService.decode(token);
            Conversation conversation = new Conversation(null, name, userId, LocalDateTime.now());
            conversationService.save(conversation);
            return new CreateConversationResult(true, "Conversation created successfully", conversation.getId());
        } catch (Exception e) {
            return new CreateConversationResult(false, "Error: " + e.getMessage(), null);
        }
    }

    public static class CreateConversationResult {
        private final boolean success;
        private final String message;
        private final Integer conversationId;

        public CreateConversationResult(boolean success, String message, Integer conversationId) {
            this.success = success;
            this.message = message;
            this.conversationId = conversationId;
        }

        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public Integer getConversationId() { return conversationId; }
    }
}
