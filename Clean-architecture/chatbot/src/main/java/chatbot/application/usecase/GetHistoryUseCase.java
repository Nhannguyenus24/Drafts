package chatbot.application.usecase;

import chatbot.application.service.JwtEncodedService;
import chatbot.domain.repository.ConversationRepository;
import chatbot.domain.entity.Conversation;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GetHistoryUseCase {

    private final ConversationRepository conversationService;
    private final JwtEncodedService jwtEncodedService;

    public GetHistoryUseCase(ConversationRepository conversationService, JwtEncodedService jwtEncodedService) {
        this.conversationService = conversationService;
        this.jwtEncodedService = jwtEncodedService;
    }

    public GetHistoryResult execute(String token) {
        try {
            Integer userId = jwtEncodedService.decode(token);
            List<Conversation> conversations = conversationService.findByUserId(userId);
            return new GetHistoryResult(true, "Conversation created successfully", conversations);
        } catch (Exception e) {
            return new GetHistoryResult(false, "Error: " + e.getMessage(), null);
        }
    }

    public static class GetHistoryResult {
        private final boolean success;
        private final String message;
        private final List<Conversation> conversation;

        public GetHistoryResult(boolean success, String message, List<Conversation> conversation) {
            this.success = success;
            this.message = message;
            this.conversation = conversation;
        }

        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public List<Conversation> getConversationId() { return conversation; }
    }
}
