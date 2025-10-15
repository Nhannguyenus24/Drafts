package realtime.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import realtime.dto.DailyLeaderboardDTO;
import realtime.dto.UserStatsDTO;
import realtime.repository.IRedisRepository;
import realtime.repository.IRepository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Scheduled service to calculate and cache daily leaderboards
 * Runs every day at midnight (00:00:00)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LeaderboardSchedulerService {
    
    private final IRepository repository;
    private final IRedisRepository redisRepository;
    
    private static final String LEADERBOARD_CACHE_KEY = "daily_leaderboard";
    private static final String TOP_BY_WINS_KEY = "leaderboard:top_by_wins";
    private static final String TOP_BY_MATCHES_KEY = "leaderboard:top_by_matches";
    private static final String TOP_BY_WINRATE_KEY = "leaderboard:top_by_winrate";
    private static final long CACHE_TTL = 86400; // 24 hours in seconds
    private static final int MINIMUM_MATCHES_FOR_WINRATE = 10;
    
    /**
     * Scheduled task that runs every day at midnight (00:00:00)
     * Cron format: second minute hour day month weekday
     */
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Ho_Chi_Minh")
    public void calculateDailyLeaderboards() {
        log.info("Starting daily leaderboard calculation at {}", LocalDateTime.now());
        
        try {
            // Calculate top 100 by wins
            log.info("Calculating top 100 by wins...");
            List<UserStatsDTO> topByWins = repository.getTop100ByWins();
            redisRepository.set(TOP_BY_WINS_KEY, topByWins, CACHE_TTL);
            log.info("Cached {} users in top-by-wins leaderboard", topByWins.size());
            
            // Calculate top 100 by matches played
            log.info("Calculating top 100 by matches played...");
            List<UserStatsDTO> topByMatches = repository.getTop100ByMatchesPlayed();
            redisRepository.set(TOP_BY_MATCHES_KEY, topByMatches, CACHE_TTL);
            log.info("Cached {} users in top-by-matches leaderboard", topByMatches.size());
            
            // Calculate top 100 by win rate (minimum 10 matches)
            log.info("Calculating top 100 by win rate (min {} matches)...", MINIMUM_MATCHES_FOR_WINRATE);
            List<UserStatsDTO> topByWinRate = repository.getTop100ByWinRate(MINIMUM_MATCHES_FOR_WINRATE);
            redisRepository.set(TOP_BY_WINRATE_KEY, topByWinRate, CACHE_TTL);
            log.info("Cached {} users in top-by-winrate leaderboard", topByWinRate.size());
            
            // Get total users count
            int totalUsers = repository.getTotalUsersCount();
            
            // Create combined leaderboard DTO
            DailyLeaderboardDTO dailyLeaderboard = DailyLeaderboardDTO.builder()
                    .topByWins(topByWins)
                    .topByMatchesPlayed(topByMatches)
                    .topByWinRate(topByWinRate)
                    .lastUpdated(LocalDateTime.now())
                    .totalUsers(totalUsers)
                    .build();
            
            // Cache the complete leaderboard
            redisRepository.set(LEADERBOARD_CACHE_KEY, dailyLeaderboard, CACHE_TTL);
            
            // Update Redis sorted set for real-time leaderboard
            updateRealTimeLeaderboard(topByWins);
            
            log.info("Daily leaderboard calculation completed successfully at {}. Total users: {}", 
                    LocalDateTime.now(), totalUsers);
            
        } catch (Exception e) {
            log.error("Error calculating daily leaderboards", e);
        }
    }
    
    /**
     * Manual trigger for leaderboard calculation
     * Can be called via API endpoint for immediate update
     */
    public DailyLeaderboardDTO calculateLeaderboardsNow() {
        log.info("Manual leaderboard calculation triggered at {}", LocalDateTime.now());
        calculateDailyLeaderboards();
        return getCachedLeaderboard();
    }
    
    /**
     * Get cached daily leaderboard
     */
    public DailyLeaderboardDTO getCachedLeaderboard() {
        try {
            var cached = redisRepository.get(LEADERBOARD_CACHE_KEY);
            if (cached.isPresent()) {
                return (DailyLeaderboardDTO) cached.get();
            }
        } catch (Exception e) {
            log.warn("Error retrieving cached leaderboard, calculating new one", e);
        }
        
        // If not cached, calculate now
        return calculateLeaderboardsNow();
    }
    
    /**
     * Get top 100 by wins from cache
     */
    public List<UserStatsDTO> getTopByWins() {
        try {
            var cached = redisRepository.get(TOP_BY_WINS_KEY);
            if (cached.isPresent()) {
                return (List<UserStatsDTO>) cached.get();
            }
        } catch (Exception e) {
            log.warn("Error retrieving top-by-wins, fetching from database", e);
        }
        
        return repository.getTop100ByWins();
    }
    
    /**
     * Get top 100 by matches played from cache
     */
    public List<UserStatsDTO> getTopByMatchesPlayed() {
        try {
            var cached = redisRepository.get(TOP_BY_MATCHES_KEY);
            if (cached.isPresent()) {
                return (List<UserStatsDTO>) cached.get();
            }
        } catch (Exception e) {
            log.warn("Error retrieving top-by-matches, fetching from database", e);
        }
        
        return repository.getTop100ByMatchesPlayed();
    }
    
    /**
     * Get top 100 by win rate from cache
     */
    public List<UserStatsDTO> getTopByWinRate() {
        try {
            var cached = redisRepository.get(TOP_BY_WINRATE_KEY);
            if (cached.isPresent()) {
                return (List<UserStatsDTO>) cached.get();
            }
        } catch (Exception e) {
            log.warn("Error retrieving top-by-winrate, fetching from database", e);
        }
        
        return repository.getTop100ByWinRate(MINIMUM_MATCHES_FOR_WINRATE);
    }
    
    /**
     * Update Redis sorted set for real-time leaderboard queries
     */
    private void updateRealTimeLeaderboard(List<UserStatsDTO> topUsers) {
        try {
            topUsers.forEach(user -> {
                redisRepository.updateLeaderboard(user.getUserId(), user.getScore());
            });
            log.info("Updated real-time leaderboard with {} users", topUsers.size());
        } catch (Exception e) {
            log.error("Error updating real-time leaderboard", e);
        }
    }
    
    /**
     * Get leaderboard last update time
     */
    public LocalDateTime getLastUpdateTime() {
        DailyLeaderboardDTO leaderboard = getCachedLeaderboard();
        return leaderboard != null ? leaderboard.getLastUpdated() : null;
    }
    
    /**
     * Check if leaderboard needs update (older than 24 hours)
     */
    public boolean needsUpdate() {
        LocalDateTime lastUpdate = getLastUpdateTime();
        if (lastUpdate == null) {
            return true;
        }
        return LocalDateTime.now().minusHours(24).isAfter(lastUpdate);
    }
}
