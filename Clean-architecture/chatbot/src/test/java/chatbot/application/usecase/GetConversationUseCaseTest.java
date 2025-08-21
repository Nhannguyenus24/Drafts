package chatbot.application.usecase;

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
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GetConversationUseCaseTest {

    @Mock
    private ConversationRepository conversationRepository;

    private GetConversationUseCase getConversationUseCase;

    @BeforeEach
    void setUp() {
        getConversationUseCase = new GetConversationUseCase(conversationRepository);
    }

    @Test
    void execute_WithValidConversationId_ShouldReturnSuccess() {
        // Arrange
        Integer conversationId = 1;
        List<Message> messages = new ArrayList<>();
        messages.add(new Message(1, "Hello", LocalDateTime.now(), true));
        messages.add(new Message(2, "Hi there!", LocalDateTime.now(), false));

        when(conversationRepository.getMessages(conversationId)).thenReturn(messages);

        // Act
        GetConversationUseCase.GetConversationResult result = getConversationUseCase.execute(conversationId);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Get message successfully", result.getMessage());
        assertEquals(messages, result.getConversation());
        assertEquals(2, result.getConversation().size());
    }

    @Test
    void execute_WithEmptyConversation_ShouldReturnSuccess() {
        // Arrange
        Integer conversationId = 1;
        List<Message> messages = new ArrayList<>();

        when(conversationRepository.getMessages(conversationId)).thenReturn(messages);

        // Act
        GetConversationUseCase.GetConversationResult result = getConversationUseCase.execute(conversationId);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Get message successfully", result.getMessage());
        assertEquals(messages, result.getConversation());
        assertTrue(result.getConversation().isEmpty());
    }

    @Test
    void execute_WithNullConversation_ShouldReturnSuccess() {
        // Arrange
        Integer conversationId = 1;

        when(conversationRepository.getMessages(conversationId)).thenReturn(null);

        // Act
        GetConversationUseCase.GetConversationResult result = getConversationUseCase.execute(conversationId);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Get message successfully", result.getMessage());
        assertNull(result.getConversation());
    }

    @Test
    void execute_WithRepositoryException_ShouldReturnFailure() {
        // Arrange
        Integer conversationId = 1;

        when(conversationRepository.getMessages(conversationId)).thenThrow(new RuntimeException("Database error"));

        // Act
        GetConversationUseCase.GetConversationResult result = getConversationUseCase.execute(conversationId);

        // Assert
        assertFalse(result.isSuccess());
        assertTrue(result.getMessage().contains("Error:"));
        assertNull(result.getConversation());
    }

    @Test
    void execute_WithNullConversationId_ShouldReturnFailure() {
        // Arrange
        when(conversationRepository.getMessages(null)).thenThrow(new RuntimeException("Invalid conversation ID"));

        // Act
        GetConversationUseCase.GetConversationResult result = getConversationUseCase.execute(null);

        // Assert
        assertFalse(result.isSuccess());
        assertTrue(result.getMessage().contains("Error:"));
        assertNull(result.getConversation());
    }
}

