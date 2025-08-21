package chatbot.application.usecase;

import chatbot.application.service.AIChatService;
import chatbot.application.service.JwtEncodedService;
import chatbot.domain.entity.Message;
import chatbot.domain.repository.ConversationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SendMessageUseCaseTest {

    @Mock
    private ConversationRepository conversationRepository;

    @Mock
    private JwtEncodedService jwtEncodedService;

    @Mock
    private AIChatService aiChatService;

    private SendMessageUseCase sendMessageUseCase;

    @BeforeEach
    void setUp() {
        sendMessageUseCase = new SendMessageUseCase(conversationRepository, jwtEncodedService, aiChatService);
    }

    @Test
    void execute_WithValidData_ShouldReturnSuccess() {
        // Arrange
        Integer conversationId = 1;
        String token = "valid.token.here";
        String prompt = "Hello, how are you?";
        Integer userId = 1;
        String aiResponse = "I'm doing well, thank you for asking!";
        List<Message> existingMessages = new ArrayList<>();

        when(jwtEncodedService.decode(token)).thenReturn(userId);
        when(conversationRepository.getMessages(conversationId)).thenReturn(existingMessages);
        when(aiChatService.generateResponse(prompt, conversationId)).thenReturn(aiResponse);

        // Act
        SendMessageUseCase.SendMessageResult result = sendMessageUseCase.execute(conversationId, token, prompt);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Message sent successfully", result.getMessage());
        assertEquals(aiResponse, result.getAiResponse());
    }

    @Test
    void execute_WithInvalidToken_ShouldReturnFailure() {
        // Arrange
        Integer conversationId = 1;
        String token = "invalid.token.here";
        String prompt = "Hello";

        when(jwtEncodedService.decode(token)).thenThrow(new RuntimeException("Invalid token"));

        // Act
        SendMessageUseCase.SendMessageResult result = sendMessageUseCase.execute(conversationId, token, prompt);

        // Assert
        assertFalse(result.isSuccess());
        assertTrue(result.getMessage().contains("Error processing message"));
        assertNull(result.getAiResponse());
    }

    @Test
    void execute_WithNonExistentConversation_ShouldReturnFailure() {
        // Arrange
        Integer conversationId = 999;
        String token = "valid.token.here";
        String prompt = "Hello";
        Integer userId = 1;

        when(jwtEncodedService.decode(token)).thenReturn(userId);
        when(conversationRepository.getMessages(conversationId)).thenReturn(null);

        // Act
        SendMessageUseCase.SendMessageResult result = sendMessageUseCase.execute(conversationId, token, prompt);

        // Assert
        assertFalse(result.isSuccess());
        assertEquals("Conversation not found or access denied", result.getMessage());
        assertNull(result.getAiResponse());
    }

    @Test
    void execute_WithNullPrompt_ShouldReturnSuccess() {
        // Arrange
        Integer conversationId = 1;
        String token = "valid.token.here";
        String prompt = null;
        Integer userId = 1;
        String aiResponse = "I received your message.";
        List<Message> existingMessages = new ArrayList<>();

        when(jwtEncodedService.decode(token)).thenReturn(userId);
        when(conversationRepository.getMessages(conversationId)).thenReturn(existingMessages);
        when(aiChatService.generateResponse(prompt, conversationId)).thenReturn(aiResponse);

        // Act
        SendMessageUseCase.SendMessageResult result = sendMessageUseCase.execute(conversationId, token, prompt);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Message sent successfully", result.getMessage());
        assertEquals(aiResponse, result.getAiResponse());
    }

    @Test
    void execute_WithEmptyPrompt_ShouldReturnSuccess() {
        // Arrange
        Integer conversationId = 1;
        String token = "valid.token.here";
        String prompt = "";
        Integer userId = 1;
        String aiResponse = "I received your message.";
        List<Message> existingMessages = new ArrayList<>();

        when(jwtEncodedService.decode(token)).thenReturn(userId);
        when(conversationRepository.getMessages(conversationId)).thenReturn(existingMessages);
        when(aiChatService.generateResponse(prompt, conversationId)).thenReturn(aiResponse);

        // Act
        SendMessageUseCase.SendMessageResult result = sendMessageUseCase.execute(conversationId, token, prompt);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Message sent successfully", result.getMessage());
        assertEquals(aiResponse, result.getAiResponse());
    }

    @Test
    void execute_WithAiServiceException_ShouldReturnFailure() {
        // Arrange
        Integer conversationId = 1;
        String token = "valid.token.here";
        String prompt = "Hello";
        Integer userId = 1;
        List<Message> existingMessages = new ArrayList<>();

        when(jwtEncodedService.decode(token)).thenReturn(userId);
        when(conversationRepository.getMessages(conversationId)).thenReturn(existingMessages);
        when(aiChatService.generateResponse(prompt, conversationId)).thenThrow(new RuntimeException("AI service error"));

        // Act
        SendMessageUseCase.SendMessageResult result = sendMessageUseCase.execute(conversationId, token, prompt);

        // Assert
        assertFalse(result.isSuccess());
        assertTrue(result.getMessage().contains("Error processing message"));
        assertNull(result.getAiResponse());
    }
}

