package chatbot.Interface.controller;

import chatbot.Interface.dto.ResponseDto;
import chatbot.Interface.dto.SendMessageRequestDto;
import chatbot.application.usecase.CreateConversationUseCase;
import chatbot.application.usecase.GetConversationUseCase;
import chatbot.application.usecase.GetHistoryUseCase;
import chatbot.application.usecase.SendMessageUseCase;
import chatbot.domain.entity.Conversation;
import chatbot.domain.entity.Message;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class    ChatController {

    private final SendMessageUseCase sendMessageUseCase;
    private final CreateConversationUseCase createConversationUseCase;
    private final GetHistoryUseCase getHistoryUseCase;
    private final GetConversationUseCase GetConversationUseCase;

    public ChatController(SendMessageUseCase sendMessageUseCase,
                          CreateConversationUseCase createConversationUseCase, GetHistoryUseCase getHistoryUseCase, GetConversationUseCase GetConversationUseCase) {
        this.sendMessageUseCase = sendMessageUseCase;
        this.createConversationUseCase = createConversationUseCase;
        this.getHistoryUseCase = getHistoryUseCase;
        this.GetConversationUseCase = GetConversationUseCase;
    }

    @PostMapping("/create")
    public ResponseEntity<ResponseDto<Integer>> createConversation(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam String name) {

        String token = authorizationHeader.replace("Bearer ", "");
        var result = createConversationUseCase.execute(token, name);

        if (!result.isSuccess()) {
            return ResponseEntity.status(500)
                    .body(new ResponseDto<>(result.getMessage(), null, 500));
        }

        return ResponseEntity.ok(new ResponseDto<>("Created", result.getConversationId(), 201));
    }

    @GetMapping("/history")
    public ResponseEntity<ResponseDto<List<Conversation>>> history(
            @RequestHeader("Authorization") String authorizationHeader
    ){
        String token = authorizationHeader.replace("Bearer ", "");
        GetHistoryUseCase.GetHistoryResult result = getHistoryUseCase.execute(token);
        if (!result.isSuccess()) {
            int statusCode = result.getMessage().contains("not found") ? 403 : 500;
            return ResponseEntity.status(statusCode)
                    .body(new ResponseDto<>(result.getMessage(), null, statusCode));
        }
        return ResponseEntity.ok(new ResponseDto<>("Success", result.getConversationId(), 200));
    }
    @GetMapping("/getConversation/{conversationId}")
    public ResponseEntity<ResponseDto<List<Message>>> getConversation(
            @PathVariable Integer conversationId,
            @RequestHeader("Authorization") String authorizationHeader) {

        String token = authorizationHeader.replace("Bearer ", "");
        GetConversationUseCase.GetConversationResult result = GetConversationUseCase.execute(conversationId);

        if (!result.isSuccess()) {
            int statusCode = result.getMessage().contains("not found") || result.getMessage().contains("access denied") ? 404 : 500;
            return ResponseEntity.status(statusCode)
                    .body(new ResponseDto<>(result.getMessage(), null, statusCode));
        }

        return ResponseEntity.ok(new ResponseDto<>("Success", result.getConversation(), 200));
    }


    @PostMapping("/getResponse/{conversationId}")
    public ResponseEntity<ResponseDto<String>> sendMessage(
            @PathVariable Integer conversationId,
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody SendMessageRequestDto dto) {

        String token = authorizationHeader.replace("Bearer ", "");
        SendMessageUseCase.SendMessageResult result = sendMessageUseCase.execute(conversationId, token, dto.getPrompt());

        if (!result.isSuccess()) {
            int statusCode = result.getMessage().contains("not found") || result.getMessage().contains("access denied") ? 404 : 500;
            return ResponseEntity.status(statusCode)
                    .body(new ResponseDto<>(result.getMessage(), null, statusCode));
        }

        return ResponseEntity.ok(new ResponseDto<>("Success", result.getAiResponse(), 200));
    }
}
