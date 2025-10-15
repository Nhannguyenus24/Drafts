package realtime.repository;

import realtime.model.Match;
import realtime.model.User;

import java.util.List;
import java.util.Optional;

/**
 * Redis Repository Interface for caching and real-time data operations
 */
public interface IRedisRepository {
    
    // ==================== User Cache Operations ====================
    
    /**
     * Cache user data in Redis
     * @param user User object to cache
     * @param ttl Time to live in seconds
     */
    void cacheUser(User user, long ttl);
    
    /**
     * Get cached user by ID
     * @param userId User ID
     * @return Optional of User
     */
    Optional<User> getCachedUser(int userId);
    
    /**
     * Remove user from cache
     * @param userId User ID
     */
    void evictUser(int userId);
    
    /**
     * Check if user is cached
     * @param userId User ID
     * @return true if exists in cache
     */
    boolean isUserCached(int userId);
    
    // ==================== Session Management ====================
    
    /**
     * Store user session
     * @param userId User ID
     * @param token JWT token
     * @param ttl Time to live in seconds
     */
    void storeSession(int userId, String token, long ttl);
    
    /**
     * Get session token for user
     * @param userId User ID
     * @return Optional of token
     */
    Optional<String> getSession(int userId);
    
    /**
     * Invalidate user session
     * @param userId User ID
     */
    void invalidateSession(int userId);
    
    /**
     * Check if session is valid
     * @param userId User ID
     * @return true if session exists
     */
    boolean isSessionValid(int userId);
    
    // ==================== Match Cache Operations ====================
    
    /**
     * Cache match data
     * @param match Match object to cache
     * @param ttl Time to live in seconds
     */
    void cacheMatch(Match match, long ttl);
    
    /**
     * Get cached match by ID
     * @param matchId Match ID
     * @return Optional of Match
     */
    Optional<Match> getCachedMatch(int matchId);
    
    /**
     * Remove match from cache
     * @param matchId Match ID
     */
    void evictMatch(int matchId);
    
    /**
     * Update match status in cache
     * @param matchId Match ID
     * @param status New status
     */
    void updateMatchStatus(int matchId, String status);
    
    // ==================== Active Match Management ====================
    
    /**
     * Add user to active match
     * @param matchId Match ID
     * @param userId User ID
     */
    void addUserToActiveMatch(int matchId, int userId);
    
    /**
     * Remove user from active match
     * @param matchId Match ID
     * @param userId User ID
     */
    void removeUserFromActiveMatch(int matchId, int userId);
    
    /**
     * Get all users in an active match
     * @param matchId Match ID
     * @return List of user IDs
     */
    List<Integer> getActiveMatchUsers(int matchId);
    
    /**
     * Check if user is in an active match
     * @param userId User ID
     * @return Optional of match ID
     */
    Optional<Integer> getUserActiveMatch(int userId);
    
    // ==================== Online Users ====================
    
    /**
     * Mark user as online
     * @param userId User ID
     * @param ttl Time to live in seconds
     */
    void setUserOnline(int userId, long ttl);
    
    /**
     * Mark user as offline
     * @param userId User ID
     */
    void setUserOffline(int userId);
    
    /**
     * Check if user is online
     * @param userId User ID
     * @return true if user is online
     */
    boolean isUserOnline(int userId);
    
    /**
     * Get all online users
     * @return List of online user IDs
     */
    List<Integer> getOnlineUsers();
    
    // ==================== Leaderboard/Ranking ====================
    
    /**
     * Update user score in leaderboard
     * @param userId User ID
     * @param score Score value
     */
    void updateLeaderboard(int userId, double score);
    
    /**
     * Get top users from leaderboard
     * @param limit Number of top users to retrieve
     * @return List of user IDs in order
     */
    List<Integer> getTopPlayers(int limit);
    
    /**
     * Get user rank in leaderboard
     * @param userId User ID
     * @return Rank position (0-based)
     */
    Long getUserRank(int userId);
    
    /**
     * Get user score from leaderboard
     * @param userId User ID
     * @return Score value
     */
    Double getUserScore(int userId);
    
    // ==================== Match Queue ====================
    
    /**
     * Add user to matchmaking queue
     * @param userId User ID
     */
    void addToMatchQueue(int userId);
    
    /**
     * Remove user from matchmaking queue
     * @param userId User ID
     */
    void removeFromMatchQueue(int userId);
    
    /**
     * Get users in matchmaking queue
     * @param limit Maximum number of users to retrieve
     * @return List of user IDs
     */
    List<Integer> getMatchQueue(int limit);
    
    /**
     * Get queue size
     * @return Number of users in queue
     */
    long getMatchQueueSize();
    
    // ==================== General Cache Operations ====================
    
    /**
     * Store any value with key
     * @param key Cache key
     * @param value Value to store
     * @param ttl Time to live in seconds
     */
    void set(String key, Object value, long ttl);
    
    /**
     * Get value by key
     * @param key Cache key
     * @return Optional of value
     */
    Optional<Object> get(String key);
    
    /**
     * Delete key from cache
     * @param key Cache key
     */
    void delete(String key);
    
    /**
     * Check if key exists
     * @param key Cache key
     * @return true if exists
     */
    boolean exists(String key);
    
    /**
     * Set expiration time for a key
     * @param key Cache key
     * @param ttl Time to live in seconds
     * @return true if successful
     */
    boolean expire(String key, long ttl);
    
    /**
     * Clear all cache
     */
    void clearAll();
}
