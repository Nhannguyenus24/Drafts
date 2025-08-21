package chatbot.domain.entity;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    void constructor_WithValidData_ShouldCreateUser() {
        // Arrange & Act
        User user = new User(1, "Test User", "test@example.com", "password123");

        // Assert
        assertEquals(1, user.getId());
        assertEquals("Test User", user.getName());
        assertEquals("test@example.com", user.getEmail());
        assertEquals("password123", user.getPassword());
    }

    @Test
    void constructor_WithNullId_ShouldCreateUser() {
        // Arrange & Act
        User user = new User(null, "Test User", "test@example.com", "password123");

        // Assert
        assertNull(user.getId());
        assertEquals("Test User", user.getName());
        assertEquals("test@example.com", user.getEmail());
        assertEquals("password123", user.getPassword());
    }

    @Test
    void setId_ShouldUpdateId() {
        // Arrange
        User user = new User(1, "Test User", "test@example.com", "password123");

        // Act
        user.setId(2);

        // Assert
        assertEquals(2, user.getId());
    }

    @Test
    void setName_ShouldUpdateName() {
        // Arrange
        User user = new User(1, "Test User", "test@example.com", "password123");

        // Act
        user.setName("Updated User");

        // Assert
        assertEquals("Updated User", user.getName());
    }

    @Test
    void setEmail_ShouldUpdateEmail() {
        // Arrange
        User user = new User(1, "Test User", "test@example.com", "password123");

        // Act
        user.setEmail("updated@example.com");

        // Assert
        assertEquals("updated@example.com", user.getEmail());
    }

    @Test
    void setPassword_ShouldUpdatePassword() {
        // Arrange
        User user = new User(1, "Test User", "test@example.com", "password123");

        // Act
        user.setPassword("newpassword456");

        // Assert
        assertEquals("newpassword456", user.getPassword());
    }

    @Test
    void constructor_WithNullValues_ShouldCreateUser() {
        // Arrange & Act
        User user = new User(null, null, null, null);

        // Assert
        assertNull(user.getId());
        assertNull(user.getName());
        assertNull(user.getEmail());
        assertNull(user.getPassword());
    }

    @Test
    void setNullValues_ShouldUpdateFields() {
        // Arrange
        User user = new User(1, "Test User", "test@example.com", "password123");

        // Act
        user.setId(null);
        user.setName(null);
        user.setEmail(null);
        user.setPassword(null);

        // Assert
        assertNull(user.getId());
        assertNull(user.getName());
        assertNull(user.getEmail());
        assertNull(user.getPassword());
    }
}

