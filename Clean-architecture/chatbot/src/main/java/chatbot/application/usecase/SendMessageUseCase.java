package chatbot.application.usecase;

import chatbot.application.service.JwtEncodedService;
import chatbot.domain.entity.Message;
import chatbot.application.service.AIChatService;
import chatbot.domain.repository.ConversationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SendMessageUseCase {
    
    private final ConversationRepository conversationRepository;
    private final JwtEncodedService jwtEncodedService;
    private final AIChatService aiChatService;
    
    public SendMessageUseCase(ConversationRepository conversationRepository,
                             JwtEncodedService jwtEncodedService,
                              AIChatService aiChatService) {
        this.conversationRepository = conversationRepository;
        this.jwtEncodedService = jwtEncodedService;
        this.aiChatService = aiChatService;
    }
    
    public SendMessageResult execute(Integer conversationId, String token, String prompt) {
        try {
            Integer userId = jwtEncodedService.decode(token);
            
            // Validate user owns conversation
            List<Message> conversationOpt = conversationRepository.getMessages(conversationId);
            
            if (conversationOpt == null) {
                return new SendMessageResult(false, "Conversation not found or access denied", null);
            }
            
            // Generate AI response
            String reply = aiChatService.generateResponse(prompt, conversationId);
            
            // Save user message
            conversationRepository.addMessage(conversationId,
                    new Message(null, prompt, LocalDateTime.now(), true));
            
            // Save AI response
            conversationRepository.addMessage(conversationId,
                    new Message(null, reply, LocalDateTime.now(), false));
            
            return new SendMessageResult(true, "Message sent successfully", reply);
            
        } catch (Exception e) {
            return new SendMessageResult(false, "Error processing message: " + e.getMessage(), null);
        }
    }
    
    public static class SendMessageResult {
        private final boolean success;
        private final String message;
        private final String aiResponse;
        
        public SendMessageResult(boolean success, String message, String aiResponse) {
            this.success = success;
            this.message = message;
            this.aiResponse = aiResponse;
        }
        
        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public String getAiResponse() { return aiResponse; }
    }
} 