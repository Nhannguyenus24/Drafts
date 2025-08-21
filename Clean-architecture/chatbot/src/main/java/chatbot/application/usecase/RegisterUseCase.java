package chatbot.application.usecase;

import chatbot.application.service.JwtEncodedService;
import chatbot.domain.entity.User;
import chatbot.domain.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RegisterUseCase {
    
    private final UserRepository userRepository;
    private final JwtEncodedService jwtEncodedService;
    
    public RegisterUseCase(UserRepository userRepository, JwtEncodedService jwtEncodedService) {
        this.userRepository = userRepository;
        this.jwtEncodedService = jwtEncodedService;
    }
    
    public RegisterResult execute(String name, String email, String password) {
        // Check if user already exists
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            return new RegisterResult(false, "Email already in use", null);
        }
        
        // Create and save new user
        User newUser = new User(null, name, email, password);
        int id = userRepository.save(newUser);
        
        // Encode user ID as token
        String token = jwtEncodedService.encode(id);
        
        return new RegisterResult(true, "User registered successfully", token);
    }
    
    public static class RegisterResult {
        private final boolean success;
        private final String message;
        private final String token;
        
        public RegisterResult(boolean success, String message, String token) {
            this.success = success;
            this.message = message;
            this.token = token;
        }
        
        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public String getToken() { return token; }
    }
} 