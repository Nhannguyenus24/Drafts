package chatbot.domain.entity;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class MessageTest {

    @Test
    void constructor_WithValidData_ShouldCreateMessage() {
        // Arrange
        LocalDateTime timestamp = LocalDateTime.now();

        // Act
        Message message = new Message(1, "Hello, world!", timestamp, true);

        // Assert
        assertEquals(1, message.getId());
        assertEquals("Hello, world!", message.getContent());
        assertEquals(timestamp, message.getTimestamp());
        assertTrue(message.getIsUser());
    }

    @Test
    void constructor_WithNullId_ShouldCreateMessage() {
        // Arrange
        LocalDateTime timestamp = LocalDateTime.now();

        // Act
        Message message = new Message(null, "Hello, world!", timestamp, false);

        // Assert
        assertNull(message.getId());
        assertEquals("Hello, world!", message.getContent());
        assertEquals(timestamp, message.getTimestamp());
        assertFalse(message.getIsUser());
    }

    @Test
    void constructor_WithNullContent_ShouldCreateMessage() {
        // Arrange
        LocalDateTime timestamp = LocalDateTime.now();

        // Act
        Message message = new Message(1, null, timestamp, true);

        // Assert
        assertEquals(1, message.getId());
        assertNull(message.getContent());
        assertEquals(timestamp, message.getTimestamp());
        assertTrue(message.getIsUser());
    }

    @Test
    void constructor_WithNullTimestamp_ShouldCreateMessage() {
        // Act
        Message message = new Message(1, "Hello, world!", null, false);

        // Assert
        assertEquals(1, message.getId());
        assertEquals("Hello, world!", message.getContent());
        assertNull(message.getTimestamp());
        assertFalse(message.getIsUser());
    }

    @Test
    void constructor_WithNullIsUser_ShouldCreateMessage() {
        // Arrange
        LocalDateTime timestamp = LocalDateTime.now();

        // Act
        Message message = new Message(1, "Hello, world!", timestamp, null);

        // Assert
        assertEquals(1, message.getId());
        assertEquals("Hello, world!", message.getContent());
        assertEquals(timestamp, message.getTimestamp());
        assertNull(message.getIsUser());
    }

    @Test
    void constructor_WithAllNullValues_ShouldCreateMessage() {
        // Act
        Message message = new Message(null, null, null, null);

        // Assert
        assertNull(message.getId());
        assertNull(message.getContent());
        assertNull(message.getTimestamp());
        assertNull(message.getIsUser());
    }

    @Test
    void getIsUser_WithTrueValue_ShouldReturnTrue() {
        // Arrange
        LocalDateTime timestamp = LocalDateTime.now();
        Message message = new Message(1, "User message", timestamp, true);

        // Act & Assert
        assertTrue(message.getIsUser());
    }

    @Test
    void getIsUser_WithFalseValue_ShouldReturnFalse() {
        // Arrange
        LocalDateTime timestamp = LocalDateTime.now();
        Message message = new Message(1, "AI response", timestamp, false);

        // Act & Assert
        assertFalse(message.getIsUser());
    }

    @Test
    void getContent_WithEmptyString_ShouldReturnEmptyString() {
        // Arrange
        LocalDateTime timestamp = LocalDateTime.now();
        Message message = new Message(1, "", timestamp, true);

        // Act & Assert
        assertEquals("", message.getContent());
    }

    @Test
    void getContent_WithLongMessage_ShouldReturnLongMessage() {
        // Arrange
        LocalDateTime timestamp = LocalDateTime.now();
        String longMessage = "This is a very long message that contains multiple sentences. " +
                "It should be handled properly by the Message entity. " +
                "The content should be preserved exactly as provided.";
        Message message = new Message(1, longMessage, timestamp, false);

        // Act & Assert
        assertEquals(longMessage, message.getContent());
    }
}

