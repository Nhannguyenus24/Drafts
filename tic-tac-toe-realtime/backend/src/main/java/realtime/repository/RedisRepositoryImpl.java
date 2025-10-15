package realtime.repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;
import realtime.model.Match;
import realtime.model.User;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
@Slf4j
public class RedisRepositoryImpl implements IRedisRepository {
    
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;
    
    // Redis key prefixes
    private static final String USER_CACHE_PREFIX = "user:";
    private static final String SESSION_PREFIX = "session:";
    private static final String MATCH_CACHE_PREFIX = "match:";
    private static final String ACTIVE_MATCH_PREFIX = "active_match:";
    private static final String USER_MATCH_PREFIX = "user_match:";
    private static final String ONLINE_USERS_KEY = "online_users";
    private static final String LEADERBOARD_KEY = "leaderboard";
    private static final String MATCH_QUEUE_KEY = "match_queue";
    
    // ==================== User Cache Operations ====================
    
    @Override
    public void cacheUser(User user, long ttl) {
        try {
            String key = USER_CACHE_PREFIX + user.getUserId();
            String jsonValue = objectMapper.writeValueAsString(user);
            redisTemplate.opsForValue().set(key, jsonValue, ttl, TimeUnit.SECONDS);
            log.debug("Cached user: {}", user.getUserId());
        } catch (JsonProcessingException e) {
            log.error("Error caching user: {}", user.getUserId(), e);
        }
    }
    
    @Override
    public Optional<User> getCachedUser(int userId) {
        try {
            String key = USER_CACHE_PREFIX + userId;
            Object value = redisTemplate.opsForValue().get(key);
            if (value != null) {
                User user = objectMapper.readValue(value.toString(), User.class);
                log.debug("Retrieved cached user: {}", userId);
                return Optional.of(user);
            }
        } catch (Exception e) {
            log.error("Error retrieving cached user: {}", userId, e);
        }
        return Optional.empty();
    }
    
    @Override
    public void evictUser(int userId) {
        String key = USER_CACHE_PREFIX + userId;
        redisTemplate.delete(key);
        log.debug("Evicted user cache: {}", userId);
    }
    
    @Override
    public boolean isUserCached(int userId) {
        String key = USER_CACHE_PREFIX + userId;
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }
    
    // ==================== Session Management ====================
    
    @Override
    public void storeSession(int userId, String token, long ttl) {
        String key = SESSION_PREFIX + userId;
        redisTemplate.opsForValue().set(key, token, ttl, TimeUnit.SECONDS);
        log.debug("Stored session for user: {}", userId);
    }
    
    @Override
    public Optional<String> getSession(int userId) {
        String key = SESSION_PREFIX + userId;
        Object value = redisTemplate.opsForValue().get(key);
        return value != null ? Optional.of(value.toString()) : Optional.empty();
    }
    
    @Override
    public void invalidateSession(int userId) {
        String key = SESSION_PREFIX + userId;
        redisTemplate.delete(key);
        log.debug("Invalidated session for user: {}", userId);
    }
    
    @Override
    public boolean isSessionValid(int userId) {
        String key = SESSION_PREFIX + userId;
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }
    
    // ==================== Match Cache Operations ====================
    
    @Override
    public void cacheMatch(Match match, long ttl) {
        try {
            String key = MATCH_CACHE_PREFIX + match.getMatchId();
            String jsonValue = objectMapper.writeValueAsString(match);
            redisTemplate.opsForValue().set(key, jsonValue, ttl, TimeUnit.SECONDS);
            log.debug("Cached match: {}", match.getMatchId());
        } catch (JsonProcessingException e) {
            log.error("Error caching match: {}", match.getMatchId(), e);
        }
    }
    
    @Override
    public Optional<Match> getCachedMatch(int matchId) {
        try {
            String key = MATCH_CACHE_PREFIX + matchId;
            Object value = redisTemplate.opsForValue().get(key);
            if (value != null) {
                Match match = objectMapper.readValue(value.toString(), Match.class);
                log.debug("Retrieved cached match: {}", matchId);
                return Optional.of(match);
            }
        } catch (Exception e) {
            log.error("Error retrieving cached match: {}", matchId, e);
        }
        return Optional.empty();
    }
    
    @Override
    public void evictMatch(int matchId) {
        String key = MATCH_CACHE_PREFIX + matchId;
        redisTemplate.delete(key);
        log.debug("Evicted match cache: {}", matchId);
    }
    
    @Override
    public void updateMatchStatus(int matchId, String status) {
        try {
            Optional<Match> cachedMatch = getCachedMatch(matchId);
            if (cachedMatch.isPresent()) {
                Match match = cachedMatch.get();
                // Note: You'll need to add a status field to Match model
                // For now, we'll just re-cache it
                cacheMatch(match, 3600); // Re-cache for 1 hour
            }
        } catch (Exception e) {
            log.error("Error updating match status: {}", matchId, e);
        }
    }
    
    // ==================== Active Match Management ====================
    
    @Override
    public void addUserToActiveMatch(int matchId, int userId) {
        String matchKey = ACTIVE_MATCH_PREFIX + matchId;
        String userKey = USER_MATCH_PREFIX + userId;
        
        redisTemplate.opsForSet().add(matchKey, userId);
        redisTemplate.opsForValue().set(userKey, matchId, 24, TimeUnit.HOURS);
        
        log.debug("Added user {} to active match {}", userId, matchId);
    }
    
    @Override
    public void removeUserFromActiveMatch(int matchId, int userId) {
        String matchKey = ACTIVE_MATCH_PREFIX + matchId;
        String userKey = USER_MATCH_PREFIX + userId;
        
        redisTemplate.opsForSet().remove(matchKey, userId);
        redisTemplate.delete(userKey);
        
        log.debug("Removed user {} from active match {}", userId, matchId);
    }
    
    @Override
    public List<Integer> getActiveMatchUsers(int matchId) {
        String key = ACTIVE_MATCH_PREFIX + matchId;
        Set<Object> members = redisTemplate.opsForSet().members(key);
        
        if (members == null || members.isEmpty()) {
            return new ArrayList<>();
        }
        
        return members.stream()
                .map(obj -> Integer.parseInt(obj.toString()))
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<Integer> getUserActiveMatch(int userId) {
        String key = USER_MATCH_PREFIX + userId;
        Object value = redisTemplate.opsForValue().get(key);
        
        if (value != null) {
            return Optional.of(Integer.parseInt(value.toString()));
        }
        return Optional.empty();
    }
    
    // ==================== Online Users ====================
    
    @Override
    public void setUserOnline(int userId, long ttl) {
        redisTemplate.opsForSet().add(ONLINE_USERS_KEY, userId);
        // Set expiration for the user's online status
        String userOnlineKey = "online:" + userId;
        redisTemplate.opsForValue().set(userOnlineKey, "1", ttl, TimeUnit.SECONDS);
        log.debug("Set user {} online", userId);
    }
    
    @Override
    public void setUserOffline(int userId) {
        redisTemplate.opsForSet().remove(ONLINE_USERS_KEY, userId);
        String userOnlineKey = "online:" + userId;
        redisTemplate.delete(userOnlineKey);
        log.debug("Set user {} offline", userId);
    }
    
    @Override
    public boolean isUserOnline(int userId) {
        String userOnlineKey = "online:" + userId;
        return Boolean.TRUE.equals(redisTemplate.hasKey(userOnlineKey));
    }
    
    @Override
    public List<Integer> getOnlineUsers() {
        Set<Object> members = redisTemplate.opsForSet().members(ONLINE_USERS_KEY);
        
        if (members == null || members.isEmpty()) {
            return new ArrayList<>();
        }
        
        return members.stream()
                .map(obj -> Integer.parseInt(obj.toString()))
                .filter(this::isUserOnline) // Filter out expired users
                .collect(Collectors.toList());
    }
    
    // ==================== Leaderboard/Ranking ====================
    
    @Override
    public void updateLeaderboard(int userId, double score) {
        redisTemplate.opsForZSet().add(LEADERBOARD_KEY, userId, score);
        log.debug("Updated leaderboard for user {} with score {}", userId, score);
    }
    
    @Override
    public List<Integer> getTopPlayers(int limit) {
        Set<Object> topPlayers = redisTemplate.opsForZSet()
                .reverseRange(LEADERBOARD_KEY, 0, limit - 1);
        
        if (topPlayers == null || topPlayers.isEmpty()) {
            return new ArrayList<>();
        }
        
        return topPlayers.stream()
                .map(obj -> Integer.parseInt(obj.toString()))
                .collect(Collectors.toList());
    }
    
    @Override
    public Long getUserRank(int userId) {
        return redisTemplate.opsForZSet().reverseRank(LEADERBOARD_KEY, userId);
    }
    
    @Override
    public Double getUserScore(int userId) {
        return redisTemplate.opsForZSet().score(LEADERBOARD_KEY, userId);
    }
    
    // ==================== Match Queue ====================
    
    @Override
    public void addToMatchQueue(int userId) {
        double timestamp = System.currentTimeMillis();
        redisTemplate.opsForZSet().add(MATCH_QUEUE_KEY, userId, timestamp);
        log.debug("Added user {} to match queue", userId);
    }
    
    @Override
    public void removeFromMatchQueue(int userId) {
        redisTemplate.opsForZSet().remove(MATCH_QUEUE_KEY, userId);
        log.debug("Removed user {} from match queue", userId);
    }
    
    @Override
    public List<Integer> getMatchQueue(int limit) {
        Set<Object> queuedUsers = redisTemplate.opsForZSet()
                .range(MATCH_QUEUE_KEY, 0, limit - 1);
        
        if (queuedUsers == null || queuedUsers.isEmpty()) {
            return new ArrayList<>();
        }
        
        return queuedUsers.stream()
                .map(obj -> Integer.parseInt(obj.toString()))
                .collect(Collectors.toList());
    }
    
    @Override
    public long getMatchQueueSize() {
        Long size = redisTemplate.opsForZSet().size(MATCH_QUEUE_KEY);
        return size != null ? size : 0;
    }
    
    // ==================== General Cache Operations ====================
    
    @Override
    public void set(String key, Object value, long ttl) {
        try {
            String jsonValue = objectMapper.writeValueAsString(value);
            redisTemplate.opsForValue().set(key, jsonValue, ttl, TimeUnit.SECONDS);
            log.debug("Set key: {}", key);
        } catch (JsonProcessingException e) {
            log.error("Error setting key: {}", key, e);
        }
    }
    
    @Override
    public Optional<Object> get(String key) {
        Object value = redisTemplate.opsForValue().get(key);
        return Optional.ofNullable(value);
    }
    
    @Override
    public void delete(String key) {
        redisTemplate.delete(key);
        log.debug("Deleted key: {}", key);
    }
    
    @Override
    public boolean exists(String key) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }
    
    @Override
    public boolean expire(String key, long ttl) {
        return Boolean.TRUE.equals(redisTemplate.expire(key, ttl, TimeUnit.SECONDS));
    }
    
    @Override
    public void clearAll() {
        Set<String> keys = redisTemplate.keys("*");
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
            log.info("Cleared all Redis cache");
        }
    }
}
