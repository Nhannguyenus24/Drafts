package chatbot.application.service;

public interface JwtEncodedService {
    String encode(Integer userId);
    Integer decode(String token);
}
