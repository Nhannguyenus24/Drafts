package chatbot.infrastructure.config;

import chatbot.application.service.JwtEncodedService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtEncodedServiceImpl implements JwtEncodedService {

    private static final String SECRET = "thulinhloaibocuadaiduongthulinhloaibocuadaiduong";
    private static final long EXPIRATION_TIME = 86400000; // 24h

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    @Override
    public String encode(Integer userId) {
        return Jwts.builder()
                .setSubject(userId.toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key)
                .compact();
    }

    public Integer decode(String token) {
        String subject = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
        return Integer.valueOf(subject);
    }
}
