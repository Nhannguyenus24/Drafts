package chatbot.domain.entity;

import java.time.LocalDateTime;

public class Message {
    private final Integer id;
    private final String content;
    private final LocalDateTime timestamp;
    private final Boolean isUser;

    public Message(Integer id, String content, LocalDateTime timestamp, Boolean isUser) {
        this.id = id;
        this.content = content;
        this.timestamp = timestamp;
        this.isUser = isUser;
    }

    public String getContent() {
        return content;
    }

    public Integer getId() {
        return id;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public Boolean getIsUser() {
        return isUser;
    }
}
