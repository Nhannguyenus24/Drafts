package chatbot.application.usecase;

import chatbot.application.service.JwtEncodedService;
import chatbot.domain.entity.User;
import chatbot.domain.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LoginUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtEncodedService jwtEncodedService;

    private LoginUseCase loginUseCase;

    @BeforeEach
    void setUp() {
        loginUseCase = new LoginUseCase(userRepository, jwtEncodedService);
    }

    @Test
    void execute_WithValidCredentials_ShouldReturnSuccess() {
        // Arrange
        String email = "test@example.com";
        String password = "password123";
        User user = new User(1, "Test User", email, password);
        String expectedToken = "jwt.token.here";

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(jwtEncodedService.encode(user.getId())).thenReturn(expectedToken);

        // Act
        LoginUseCase.LoginResult result = loginUseCase.execute(email, password);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Login successful", result.getMessage());
        assertEquals(expectedToken, result.getToken());
    }

    @Test
    void execute_WithInvalidEmail_ShouldReturnFailure() {
        // Arrange
        String email = "nonexistent@example.com";
        String password = "password123";

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Act
        LoginUseCase.LoginResult result = loginUseCase.execute(email, password);

        // Assert
        assertFalse(result.isSuccess());
        assertEquals("User not found", result.getMessage());
        assertNull(result.getToken());
    }

    @Test
    void execute_WithInvalidPassword_ShouldReturnFailure() {
        // Arrange
        String email = "test@example.com";
        String correctPassword = "password123";
        String wrongPassword = "wrongpassword";
        User user = new User(1, "Test User", email, correctPassword);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // Act
        LoginUseCase.LoginResult result = loginUseCase.execute(email, wrongPassword);

        // Assert
        assertFalse(result.isSuccess());
        assertEquals("Invalid password", result.getMessage());
        assertNull(result.getToken());
    }

    @Test
    void execute_WithNullEmail_ShouldReturnFailure() {
        // Arrange
        when(userRepository.findByEmail(null)).thenReturn(Optional.empty());

        // Act
        LoginUseCase.LoginResult result = loginUseCase.execute(null, "password123");

        // Assert
        assertFalse(result.isSuccess());
        assertEquals("User not found", result.getMessage());
        assertNull(result.getToken());
    }

    @Test
    void execute_WithEmptyEmail_ShouldReturnFailure() {
        // Arrange
        when(userRepository.findByEmail("")).thenReturn(Optional.empty());

        // Act
        LoginUseCase.LoginResult result = loginUseCase.execute("", "password123");

        // Assert
        assertFalse(result.isSuccess());
        assertEquals("User not found", result.getMessage());
        assertNull(result.getToken());
    }
}

