package chatbot.domain.entity;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ConversationTest {

    @Test
    void constructor_WithValidData_ShouldCreateConversation() {
        // Arrange
        LocalDateTime dateTime = LocalDateTime.now();

        // Act
        Conversation conversation = new Conversation(1, "Test Conversation", 1, dateTime);

        // Assert
        assertEquals(1, conversation.getId());
        assertEquals("Test Conversation", conversation.getName());
        assertEquals(1, conversation.getUserId());
        assertEquals(dateTime, conversation.getDateTime());
        assertNotNull(conversation.getMessages());
        assertTrue(conversation.getMessages().isEmpty());
    }

    @Test
    void constructor_WithNullId_ShouldCreateConversation() {
        // Arrange
        LocalDateTime dateTime = LocalDateTime.now();

        // Act
        Conversation conversation = new Conversation(null, "Test Conversation", 1, dateTime);

        // Assert
        assertNull(conversation.getId());
        assertEquals("Test Conversation", conversation.getName());
        assertEquals(1, conversation.getUserId());
        assertEquals(dateTime, conversation.getDateTime());
    }

    @Test
    void constructor_WithNullName_ShouldCreateConversation() {
        // Arrange
        LocalDateTime dateTime = LocalDateTime.now();

        // Act
        Conversation conversation = new Conversation(1, null, 1, dateTime);

        // Assert
        assertEquals(1, conversation.getId());
        assertNull(conversation.getName());
        assertEquals(1, conversation.getUserId());
        assertEquals(dateTime, conversation.getDateTime());
    }

    @Test
    void constructor_WithNullUserId_ShouldCreateConversation() {
        // Arrange
        LocalDateTime dateTime = LocalDateTime.now();

        // Act
        Conversation conversation = new Conversation(1, "Test Conversation", null, dateTime);

        // Assert
        assertEquals(1, conversation.getId());
        assertEquals("Test Conversation", conversation.getName());
        assertNull(conversation.getUserId());
        assertEquals(dateTime, conversation.getDateTime());
    }

    @Test
    void constructor_WithNullDateTime_ShouldCreateConversation() {
        // Act
        Conversation conversation = new Conversation(1, "Test Conversation", 1, null);

        // Assert
        assertEquals(1, conversation.getId());
        assertEquals("Test Conversation", conversation.getName());
        assertEquals(1, conversation.getUserId());
        assertNull(conversation.getDateTime());
    }

    @Test
    void setId_ShouldUpdateId() {
        // Arrange
        LocalDateTime dateTime = LocalDateTime.now();
        Conversation conversation = new Conversation(1, "Test Conversation", 1, dateTime);

        // Act
        conversation.setId(2);

        // Assert
        assertEquals(2, conversation.getId());
    }

    @Test
    void setName_ShouldUpdateName() {
        // Arrange
        LocalDateTime dateTime = LocalDateTime.now();
        Conversation conversation = new Conversation(1, "Test Conversation", 1, dateTime);

        // Act
        conversation.setName("Updated Conversation");

        // Assert
        assertEquals("Updated Conversation", conversation.getName());
    }

    @Test
    void setMessages_ShouldSetMessagesList() {
        // Arrange
        LocalDateTime dateTime = LocalDateTime.now();
        Conversation conversation = new Conversation(1, "Test Conversation", 1, dateTime);
        List<Message> messages = new ArrayList<>();
        messages.add(new Message(1, "Hello", LocalDateTime.now(), true));
        messages.add(new Message(2, "Hi there!", LocalDateTime.now(), false));

        // Act
        conversation.setMessages(messages);

        // Assert
        assertEquals(messages, conversation.getMessages());
        assertEquals(2, conversation.getMessages().size());
    }

    @Test
    void addMessage_ShouldAddMessageToList() {
        // Arrange
        LocalDateTime dateTime = LocalDateTime.now();
        Conversation conversation = new Conversation(1, "Test Conversation", 1, dateTime);
        Message message = new Message(1, "Hello", LocalDateTime.now(), true);

        // Act
        conversation.addMessage(message);

        // Assert
        assertEquals(1, conversation.getMessages().size());
        assertEquals(message, conversation.getMessages().get(0));
    }

    @Test
    void addMultipleMessages_ShouldAddAllMessages() {
        // Arrange
        LocalDateTime dateTime = LocalDateTime.now();
        Conversation conversation = new Conversation(1, "Test Conversation", 1, dateTime);
        Message message1 = new Message(1, "Hello", LocalDateTime.now(), true);
        Message message2 = new Message(2, "Hi there!", LocalDateTime.now(), false);
        Message message3 = new Message(3, "How are you?", LocalDateTime.now(), true);

        // Act
        conversation.addMessage(message1);
        conversation.addMessage(message2);
        conversation.addMessage(message3);

        // Assert
        assertEquals(3, conversation.getMessages().size());
        assertEquals(message1, conversation.getMessages().get(0));
        assertEquals(message2, conversation.getMessages().get(1));
        assertEquals(message3, conversation.getMessages().get(2));
    }

    @Test
    void setNullId_ShouldUpdateId() {
        // Arrange
        LocalDateTime dateTime = LocalDateTime.now();
        Conversation conversation = new Conversation(1, "Test Conversation", 1, dateTime);

        // Act
        conversation.setId(null);

        // Assert
        assertNull(conversation.getId());
    }

    @Test
    void setNullName_ShouldUpdateName() {
        // Arrange
        LocalDateTime dateTime = LocalDateTime.now();
        Conversation conversation = new Conversation(1, "Test Conversation", 1, dateTime);

        // Act
        conversation.setName(null);

        // Assert
        assertNull(conversation.getName());
    }
}
