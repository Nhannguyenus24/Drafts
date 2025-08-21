package chatbot.application.usecase;

import chatbot.application.service.JwtEncodedService;
import chatbot.domain.entity.User;
import chatbot.domain.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginUseCase {
    
    private final UserRepository userRepository;
    private final JwtEncodedService jwtEncodedService;
    
    public LoginUseCase(UserRepository userRepository, JwtEncodedService jwtEncodedService) {
        this.userRepository = userRepository;
        this.jwtEncodedService = jwtEncodedService;
    }
    
    public LoginResult execute(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            return new LoginResult(false, "User not found", null);
        }
        
        User user = userOpt.get();
        if (!user.getPassword().equals(password)) {
            return new LoginResult(false, "Invalid password", null);
        }
        
        String token = jwtEncodedService.encode(user.getId());
        return new LoginResult(true, "Login successful", token);
    }
    
    public static class LoginResult {
        private final boolean success;
        private final String message;
        private final String token;
        
        public LoginResult(boolean success, String message, String token) {
            this.success = success;
            this.message = message;
            this.token = token;
        }
        
        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public String getToken() { return token; }
    }
} 