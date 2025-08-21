package chatbot.infrastructure.external;

import chatbot.application.service.AIChatService;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
@ConditionalOnProperty(name = "ai.service.mock", havingValue = "false", matchIfMissing = true)
public class GeminiAiChatService implements AIChatService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiAiChatService.class);

    private final Client geminiClient;
    private final StringRedisTemplate redisTemplate;
    private final int MAX_HISTORY = 10;
    private final int SUMMARY_INTERVAL = 5;

    public GeminiAiChatService(
            @Value("${google.api.key}") String apiKey,
            StringRedisTemplate redisTemplate
    ) {
        this.geminiClient = new Client();
        this.redisTemplate = redisTemplate;
    }

    @Override
    public String generateResponse(String prompt, Integer conversationId) {
        String historyKey = "chat:" + conversationId + ":history";
        String summaryKey = "chat:" + conversationId + ":summary";

        try {
            logger.info("Generating AI response for conversationId={} with prompt='{}'", conversationId, prompt);

            // Step 1: Get chat history
            List<String> recentMessages = redisTemplate.opsForList().range(historyKey, -MAX_HISTORY * 2, -1);
            if (recentMessages == null) recentMessages = List.of();

            // Step 2: Build chat-style prompt
            StringBuilder chatPrompt = new StringBuilder();
            chatPrompt.append("This is a conversation between a user and an AI assistant.\n\nConversation:\n");

            for (String msg : recentMessages) {
                chatPrompt.append(msg).append("\n");
            }
            chatPrompt.append("User: ").append(prompt).append("\nAI:");

            // Step 3: Call Gemini
            GenerateContentResponse response = geminiClient.models.generateContent("gemini-2.0-flash", chatPrompt.toString(), null);
            String reply = response.text();
            logger.info("Gemini replied: {}", reply);

            // Step 4: Save new messages to history
            redisTemplate.opsForList().rightPush(historyKey, "User: " + prompt);
            redisTemplate.opsForList().rightPush(historyKey, "AI: " + reply);
            redisTemplate.expire(historyKey, Duration.ofDays(30));

            // Step 5: Update summary if needed
            Long messageCount = redisTemplate.opsForList().size(historyKey);
            if (messageCount != null && messageCount % (SUMMARY_INTERVAL * 2) == 0) {
                String summaryInput = String.join("\n", redisTemplate.opsForList().range(historyKey, -SUMMARY_INTERVAL * 2, -1));
                String summaryPrompt = "Summarize this conversation:\n" + summaryInput;
                GenerateContentResponse summaryResponse = geminiClient.models.generateContent("gemini-2.5-flash", summaryPrompt, null);
                String summary = summaryResponse.text();
                redisTemplate.opsForValue().set(summaryKey, summary, Duration.ofDays(30));
                logger.debug("Updated summary: {}", summary);
            }

            return reply;
        } catch (Exception e) {
            logger.error("Error generating response for conversationId={}: {}", conversationId, e.getMessage(), e);
            throw new RuntimeException("AI error: " + e.getMessage(), e);
        }
    }
}
