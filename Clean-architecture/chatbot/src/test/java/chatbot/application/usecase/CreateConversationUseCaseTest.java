package chatbot.application.usecase;

import chatbot.application.service.JwtEncodedService;
import chatbot.domain.entity.Conversation;
import chatbot.domain.repository.ConversationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doAnswer;

@ExtendWith(MockitoExtension.class)
class CreateConversationUseCaseTest {

    @Mock
    private ConversationRepository conversationRepository;

    @Mock
    private JwtEncodedService jwtEncodedService;

    private CreateConversationUseCase createConversationUseCase;

    @BeforeEach
    void setUp() {
        createConversationUseCase = new CreateConversationUseCase(conversationRepository, jwtEncodedService);
    }

    @Test
    void execute_WithValidData_ShouldReturnSuccess() {
        // Arrange
        String token = "valid.token.here";
        String name = "Test Conversation";
        Integer userId = 1;
        Integer conversationId = 1;

        when(jwtEncodedService.decode(token)).thenReturn(userId);
        doAnswer(invocation -> {
            Conversation conv = invocation.getArgument(0);
            conv.setId(conversationId);
            return null;
        }).when(conversationRepository).save(any(Conversation.class));

        // Act
        CreateConversationUseCase.CreateConversationResult result = createConversationUseCase.execute(token, name);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Conversation created successfully", result.getMessage());
        assertEquals(conversationId, result.getConversationId());
    }

    @Test
    void execute_WithInvalidToken_ShouldReturnFailure() {
        // Arrange
        String token = "invalid.token.here";
        String name = "Test Conversation";

        when(jwtEncodedService.decode(token)).thenThrow(new RuntimeException("Invalid token"));

        // Act
        CreateConversationUseCase.CreateConversationResult result = createConversationUseCase.execute(token, name);

        // Assert
        assertFalse(result.isSuccess());
        assertTrue(result.getMessage().contains("Error:"));
        assertNull(result.getConversationId());
    }

    @Test
    void execute_WithNullName_ShouldReturnSuccess() {
        // Arrange
        String token = "valid.token.here";
        String name = null;
        Integer userId = 1;
        Integer conversationId = 1;

        when(jwtEncodedService.decode(token)).thenReturn(userId);
        doAnswer(invocation -> {
            Conversation conv = invocation.getArgument(0);
            conv.setId(conversationId);
            return null;
        }).when(conversationRepository).save(any(Conversation.class));

        // Act
        CreateConversationUseCase.CreateConversationResult result = createConversationUseCase.execute(token, name);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Conversation created successfully", result.getMessage());
        assertEquals(conversationId, result.getConversationId());
    }

    @Test
    void execute_WithEmptyName_ShouldReturnSuccess() {
        // Arrange
        String token = "valid.token.here";
        String name = "";
        Integer userId = 1;
        Integer conversationId = 1;

        when(jwtEncodedService.decode(token)).thenReturn(userId);
        doAnswer(invocation -> {
            Conversation conv = invocation.getArgument(0);
            conv.setId(conversationId);
            return null;
        }).when(conversationRepository).save(any(Conversation.class));

        // Act
        CreateConversationUseCase.CreateConversationResult result = createConversationUseCase.execute(token, name);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Conversation created successfully", result.getMessage());
        assertEquals(conversationId, result.getConversationId());
    }

    @Test
    void execute_WithRepositoryException_ShouldReturnFailure() {
        // Arrange
        String token = "valid.token.here";
        String name = "Test Conversation";
        Integer userId = 1;

        when(jwtEncodedService.decode(token)).thenReturn(userId);
        doAnswer(invocation -> {
            throw new RuntimeException("Database error");
        }).when(conversationRepository).save(any(Conversation.class));

        // Act
        CreateConversationUseCase.CreateConversationResult result = createConversationUseCase.execute(token, name);

        // Assert
        assertFalse(result.isSuccess());
        assertTrue(result.getMessage().contains("Error:"));
        assertNull(result.getConversationId());
    }
}
