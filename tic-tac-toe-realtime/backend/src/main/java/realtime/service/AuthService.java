package realtime.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import realtime.config.JwtUtil;
import realtime.dto.AuthResponse;
import realtime.model.History;
import realtime.model.Match;
import realtime.model.User;
import realtime.repository.IRepository;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final IRepository repository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    
    public AuthResponse register(String username, String password) {
        // Hash the password
        String hashedPassword = passwordEncoder.encode(password);
        
        // Register user
        int userId = repository.userRegister(username, hashedPassword);
        
        if (userId == -1) {
            throw new RuntimeException("Username already exists");
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(username, userId);
        
        return new AuthResponse(token, userId, username);
    }
    
    public AuthResponse login(String username, String password) {
        // Get user by username
        User user = repository.getUserByUsername(username);
        
        if (user == null) {
            throw new RuntimeException("Invalid username or password");
        }
        
        // Verify password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(username, user.getUserId());
        
        return new AuthResponse(token, user.getUserId(), username);
    }
    
    public History getHistory(int userId) {
        History history = repository.getHistoryByUserId(userId);
        if (history == null) {
            throw new RuntimeException("History not found for user ID: " + userId);
        }
        return history;
    }
    
    public Match getMatch(int matchId) {
        Match match = repository.getMatchById(matchId);
        if (match == null) {
            throw new RuntimeException("Match not found with ID: " + matchId);
        }
        return match;
    }
    
    public User getUser(int userId) {
        User user = repository.getUserById(userId);
        if (user == null) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        return user;
    }
}
