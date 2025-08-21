package chatbot.application.usecase;

import chatbot.application.service.JwtEncodedService;
import chatbot.domain.entity.Conversation;
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
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GetHistoryUseCaseTest {

    @Mock
    private ConversationRepository conversationRepository;

    @Mock
    private JwtEncodedService jwtEncodedService;

    private GetHistoryUseCase getHistoryUseCase;

    @BeforeEach
    void setUp() {
        getHistoryUseCase = new GetHistoryUseCase(conversationRepository, jwtEncodedService);
    }

    @Test
    void execute_WithValidToken_ShouldReturnSuccess() {
        // Arrange
        String token = "valid.token.here";
        Integer userId = 1;
        List<Conversation> conversations = new ArrayList<>();
        conversations.add(new Conversation(1, "Conversation 1", userId, LocalDateTime.now()));
        conversations.add(new Conversation(2, "Conversation 2", userId, LocalDateTime.now()));

        when(jwtEncodedService.decode(token)).thenReturn(userId);
        when(conversationRepository.findByUserId(userId)).thenReturn(conversations);

        // Act
        GetHistoryUseCase.GetHistoryResult result = getHistoryUseCase.execute(token);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Conversation created successfully", result.getMessage());
        assertEquals(conversations, result.getConversationId());
        assertEquals(2, result.getConversationId().size());
    }

    @Test
    void execute_WithEmptyHistory_ShouldReturnSuccess() {
        // Arrange
        String token = "valid.token.here";
        Integer userId = 1;
        List<Conversation> conversations = new ArrayList<>();

        when(jwtEncodedService.decode(token)).thenReturn(userId);
        when(conversationRepository.findByUserId(userId)).thenReturn(conversations);

        // Act
        GetHistoryUseCase.GetHistoryResult result = getHistoryUseCase.execute(token);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Conversation created successfully", result.getMessage());
        assertEquals(conversations, result.getConversationId());
        assertTrue(result.getConversationId().isEmpty());
    }

    @Test
    void execute_WithInvalidToken_ShouldReturnFailure() {
        // Arrange
        String token = "invalid.token.here";

        when(jwtEncodedService.decode(token)).thenThrow(new RuntimeException("Invalid token"));

        // Act
        GetHistoryUseCase.GetHistoryResult result = getHistoryUseCase.execute(token);

        // Assert
        assertFalse(result.isSuccess());
        assertTrue(result.getMessage().contains("Error:"));
        assertNull(result.getConversationId());
    }

    @Test
    void execute_WithNullToken_ShouldReturnFailure() {
        // Arrange
        when(jwtEncodedService.decode(null)).thenThrow(new RuntimeException("Token cannot be null"));

        // Act
        GetHistoryUseCase.GetHistoryResult result = getHistoryUseCase.execute(null);

        // Assert
        assertFalse(result.isSuccess());
        assertTrue(result.getMessage().contains("Error:"));
        assertNull(result.getConversationId());
    }

    @Test
    void execute_WithRepositoryException_ShouldReturnFailure() {
        // Arrange
        String token = "valid.token.here";
        Integer userId = 1;

        when(jwtEncodedService.decode(token)).thenReturn(userId);
        when(conversationRepository.findByUserId(userId)).thenThrow(new RuntimeException("Database error"));

        // Act
        GetHistoryUseCase.GetHistoryResult result = getHistoryUseCase.execute(token);

        // Assert
        assertFalse(result.isSuccess());
        assertTrue(result.getMessage().contains("Error:"));
        assertNull(result.getConversationId());
    }
}

