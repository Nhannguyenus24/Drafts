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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RegisterUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtEncodedService jwtEncodedService;

    private RegisterUseCase registerUseCase;

    @BeforeEach
    void setUp() {
        registerUseCase = new RegisterUseCase(userRepository, jwtEncodedService);
    }

    @Test
    void execute_WithValidData_ShouldReturnSuccess() {
        // Arrange
        String name = "Test User";
        String email = "test@example.com";
        String password = "password123";
        int userId = 1;
        String expectedToken = "jwt.token.here";

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(userId);
        when(jwtEncodedService.encode(userId)).thenReturn(expectedToken);

        // Act
        RegisterUseCase.RegisterResult result = registerUseCase.execute(name, email, password);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("User registered successfully", result.getMessage());
        assertEquals(expectedToken, result.getToken());
    }

    @Test
    void execute_WithExistingEmail_ShouldReturnFailure() {
        // Arrange
        String name = "Test User";
        String email = "existing@example.com";
        String password = "password123";
        User existingUser = new User(1, "Existing User", email, "oldpassword");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(existingUser));

        // Act
        RegisterUseCase.RegisterResult result = registerUseCase.execute(name, email, password);

        // Assert
        assertFalse(result.isSuccess());
        assertEquals("Email already in use", result.getMessage());
        assertNull(result.getToken());
    }

    @Test
    void execute_WithNullName_ShouldReturnSuccess() {
        // Arrange
        String name = null;
        String email = "test@example.com";
        String password = "password123";
        int userId = 1;
        String expectedToken = "jwt.token.here";

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(userId);
        when(jwtEncodedService.encode(userId)).thenReturn(expectedToken);

        // Act
        RegisterUseCase.RegisterResult result = registerUseCase.execute(name, email, password);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("User registered successfully", result.getMessage());
        assertEquals(expectedToken, result.getToken());
    }

    @Test
    void execute_WithEmptyName_ShouldReturnSuccess() {
        // Arrange
        String name = "";
        String email = "test@example.com";
        String password = "password123";
        int userId = 1;
        String expectedToken = "jwt.token.here";

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(userId);
        when(jwtEncodedService.encode(userId)).thenReturn(expectedToken);

        // Act
        RegisterUseCase.RegisterResult result = registerUseCase.execute(name, email, password);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("User registered successfully", result.getMessage());
        assertEquals(expectedToken, result.getToken());
    }

    @Test
    void execute_WithNullEmail_ShouldReturnSuccess() {
        // Arrange
        String name = "Test User";
        String email = null;
        String password = "password123";
        int userId = 1;
        String expectedToken = "jwt.token.here";

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(userId);
        when(jwtEncodedService.encode(userId)).thenReturn(expectedToken);

        // Act
        RegisterUseCase.RegisterResult result = registerUseCase.execute(name, email, password);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("User registered successfully", result.getMessage());
        assertEquals(expectedToken, result.getToken());
    }

    @Test
    void execute_WithEmptyEmail_ShouldReturnSuccess() {
        // Arrange
        String name = "Test User";
        String email = "";
        String password = "password123";
        int userId = 1;
        String expectedToken = "jwt.token.here";

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(userId);
        when(jwtEncodedService.encode(userId)).thenReturn(expectedToken);

        // Act
        RegisterUseCase.RegisterResult result = registerUseCase.execute(name, email, password);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("User registered successfully", result.getMessage());
        assertEquals(expectedToken, result.getToken());
    }
}
