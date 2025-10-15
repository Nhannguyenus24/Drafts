package realtime.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import realtime.model.Match;
import realtime.model.User;
import realtime.repository.IRedisRepository;

import java.util.List;
import java.util.Optional;

/**
 * Service for Redis-based caching and real-time operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RedisService {
    
    private final IRedisRepository redisRepository;
    
    // Default TTL values (in seconds)
    private static final long USER_CACHE_TTL = 3600; // 1 hour
    private static final long SESSION_TTL = 86400; // 24 hours
    private static final long MATCH_CACHE_TTL = 7200; // 2 hours
    private static final long ONLINE_USER_TTL = 300; // 5 minutes
    
    // ==================== User Operations ====================
    
    /**
     * Cache user data
     */
    public void cacheUser(User user) {
        redisRepository.cacheUser(user, USER_CACHE_TTL);
    }
    
    /**
     * Get user from cache, returns empty if not found
     */
    public Optional<User> getCachedUser(int userId) {
        return redisRepository.getCachedUser(userId);
    }
    
    /**
     * Invalidate user cache
     */
    public void invalidateUserCache(int userId) {
        redisRepository.evictUser(userId);
        log.info("Invalidated cache for user: {}", userId);
    }
    
    // ==================== Session Management ====================
    
    /**
     * Store user session with JWT token
     */
    public void createSession(int userId, String token) {
        redisRepository.storeSession(userId, token, SESSION_TTL);
        log.info("Created session for user: {}", userId);
    }
    
    /**
     * Get user's active session token
     */
    public Optional<String> getSession(int userId) {
        return redisRepository.getSession(userId);
    }
    
    /**
     * Invalidate user session (logout)
     */
    public void invalidateSession(int userId) {
        redisRepository.invalidateSession(userId);
        setUserOffline(userId);
        log.info("Invalidated session for user: {}", userId);
    }
    
    /**
     * Check if user has a valid session
     */
    public boolean hasValidSession(int userId) {
        return redisRepository.isSessionValid(userId);
    }
    
    // ==================== Match Operations ====================
    
    /**
     * Cache match data
     */
    public void cacheMatch(Match match) {
        redisRepository.cacheMatch(match, MATCH_CACHE_TTL);
    }
    
    /**
     * Get match from cache
     */
    public Optional<Match> getCachedMatch(int matchId) {
        return redisRepository.getCachedMatch(matchId);
    }
    
    /**
     * Invalidate match cache
     */
    public void invalidateMatchCache(int matchId) {
        redisRepository.evictMatch(matchId);
        log.info("Invalidated cache for match: {}", matchId);
    }
    
    // ==================== Active Match Management ====================
    
    /**
     * Start a match and add users to it
     */
    public void startMatch(int matchId, int player1Id, int player2Id) {
        redisRepository.addUserToActiveMatch(matchId, player1Id);
        redisRepository.addUserToActiveMatch(matchId, player2Id);
        log.info("Started match {} with players {} and {}", matchId, player1Id, player2Id);
    }
    
    /**
     * End a match and remove users from it
     */
    public void endMatch(int matchId) {
        List<Integer> users = redisRepository.getActiveMatchUsers(matchId);
        users.forEach(userId -> redisRepository.removeUserFromActiveMatch(matchId, userId));
        log.info("Ended match: {}", matchId);
    }
    
    /**
     * Get users in an active match
     */
    public List<Integer> getMatchPlayers(int matchId) {
        return redisRepository.getActiveMatchUsers(matchId);
    }
    
    /**
     * Get user's current active match
     */
    public Optional<Integer> getUserCurrentMatch(int userId) {
        return redisRepository.getUserActiveMatch(userId);
    }
    
    /**
     * Check if user is in a match
     */
    public boolean isUserInMatch(int userId) {
        return getUserCurrentMatch(userId).isPresent();
    }
    
    // ==================== Online Users ====================
    
    /**
     * Mark user as online
     */
    public void setUserOnline(int userId) {
        redisRepository.setUserOnline(userId, ONLINE_USER_TTL);
        log.debug("User {} is now online", userId);
    }
    
    /**
     * Mark user as offline
     */
    public void setUserOffline(int userId) {
        redisRepository.setUserOffline(userId);
        log.debug("User {} is now offline", userId);
    }
    
    /**
     * Check if user is online
     */
    public boolean isUserOnline(int userId) {
        return redisRepository.isUserOnline(userId);
    }
    
    /**
     * Get list of all online users
     */
    public List<Integer> getOnlineUsers() {
        return redisRepository.getOnlineUsers();
    }
    
    /**
     * Get count of online users
     */
    public int getOnlineUsersCount() {
        return getOnlineUsers().size();
    }
    
    /**
     * Refresh user's online status (keep alive)
     */
    public void refreshOnlineStatus(int userId) {
        if (isUserOnline(userId)) {
            setUserOnline(userId);
        }
    }
    
    // ==================== Leaderboard ====================
    
    /**
     * Update user's score in leaderboard
     */
    public void updateUserScore(int userId, double score) {
        redisRepository.updateLeaderboard(userId, score);
        log.info("Updated score for user {} to {}", userId, score);
    }
    
    /**
     * Increment user's score
     */
    public void incrementUserScore(int userId, double increment) {
        Double currentScore = redisRepository.getUserScore(userId);
        double newScore = (currentScore != null ? currentScore : 0.0) + increment;
        redisRepository.updateLeaderboard(userId, newScore);
    }
    
    /**
     * Get top players from leaderboard
     */
    public List<Integer> getTopPlayers(int limit) {
        return redisRepository.getTopPlayers(limit);
    }
    
    /**
     * Get user's rank (1-based)
     */
    public long getUserRank(int userId) {
        Long rank = redisRepository.getUserRank(userId);
        return rank != null ? rank + 1 : -1; // Convert to 1-based
    }
    
    /**
     * Get user's score
     */
    public double getUserScore(int userId) {
        Double score = redisRepository.getUserScore(userId);
        return score != null ? score : 0.0;
    }
    
    // ==================== Matchmaking Queue ====================
    
    /**
     * Add user to matchmaking queue
     */
    public void joinMatchQueue(int userId) {
        if (isUserInMatch(userId)) {
            throw new IllegalStateException("User is already in a match");
        }
        redisRepository.addToMatchQueue(userId);
        log.info("User {} joined match queue", userId);
    }
    
    /**
     * Remove user from matchmaking queue
     */
    public void leaveMatchQueue(int userId) {
        redisRepository.removeFromMatchQueue(userId);
        log.info("User {} left match queue", userId);
    }
    
    /**
     * Get users waiting in queue
     */
    public List<Integer> getWaitingPlayers(int limit) {
        return redisRepository.getMatchQueue(limit);
    }
    
    /**
     * Get queue size
     */
    public long getQueueSize() {
        return redisRepository.getMatchQueueSize();
    }
    
    /**
     * Try to find a match (get 2 players from queue)
     */
    public Optional<List<Integer>> findMatch() {
        List<Integer> players = getWaitingPlayers(2);
        if (players.size() >= 2) {
            // Remove matched players from queue
            players.forEach(this::leaveMatchQueue);
            return Optional.of(players);
        }
        return Optional.empty();
    }
    
    // ==================== Statistics ====================
    
    /**
     * Get system statistics
     */
    public SystemStats getSystemStats() {
        return SystemStats.builder()
                .onlineUsers(getOnlineUsersCount())
                .queueSize(getQueueSize())
                .build();
    }
    
    /**
     * Clear all cache (use with caution!)
     */
    public void clearAllCache() {
        redisRepository.clearAll();
        log.warn("Cleared all Redis cache");
    }
    
    // Inner class for system statistics
    @lombok.Builder
    @lombok.Data
    public static class SystemStats {
        private int onlineUsers;
        private long queueSize;
    }
}
