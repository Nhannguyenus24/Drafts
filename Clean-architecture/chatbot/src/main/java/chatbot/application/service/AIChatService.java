package chatbot.application.service;

public interface AIChatService {
    String generateResponse(String prompt, Integer conversationId);
}