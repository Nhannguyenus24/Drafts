package chatbot.Interface.controller;

import chatbot.Interface.dto.LoginRequestDto;
import chatbot.Interface.dto.RegisterRequestDto;
import chatbot.Interface.dto.ResponseDto;
import chatbot.application.usecase.LoginUseCase;
import chatbot.application.usecase.RegisterUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final LoginUseCase loginUseCase;
    private final RegisterUseCase registerUseCase;

    public AuthController(LoginUseCase loginUseCase, RegisterUseCase registerUseCase) {
        this.loginUseCase = loginUseCase;
        this.registerUseCase = registerUseCase;
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseDto<Map<String, String>>> login(@RequestBody LoginRequestDto request) {
        LoginUseCase.LoginResult result = loginUseCase.execute(request.getEmail(), request.getPassword());
        
        if (!result.isSuccess()) {
            return ResponseEntity
                    .status(401)
                    .body(new ResponseDto<>(result.getMessage(), null, 401));
        }
        
        return ResponseEntity.ok(new ResponseDto<>(result.getMessage(), Map.of("token", result.getToken()), 200));
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseDto<Map<String, String>>> register(@RequestBody RegisterRequestDto request) {
        RegisterUseCase.RegisterResult result = registerUseCase.execute(
                request.getName(), 
                request.getEmail(), 
                request.getPassword()
        );
        
        if (!result.isSuccess()) {
            return ResponseEntity
                    .status(400)
                    .body(new ResponseDto<>(result.getMessage(), null, 400));
        }
        
        return ResponseEntity.ok(new ResponseDto<>(result.getMessage(), Map.of("token", result.getToken()), 200));
    }
}
