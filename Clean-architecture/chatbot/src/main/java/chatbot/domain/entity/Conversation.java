package chatbot.domain.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Conversation {
    private Integer id;
    private String name;
    private final Integer userId;
    private final LocalDateTime dateTime;
    private List<Message> messages;

    public Conversation(Integer id, String name, Integer userId, LocalDateTime dateTime) {
        this.name = name;
        this.userId = userId;
        this.dateTime = dateTime;
        this.messages = new ArrayList<>();
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getUserId() {
        return userId;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void addMessage(Message message) {
        this.messages.add(message);
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) { this.id = id; }
}
