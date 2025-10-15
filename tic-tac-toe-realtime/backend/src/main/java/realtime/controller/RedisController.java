package realtime.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import realtime.dto.ApiResponse;
import realtime.service.RedisService;

import java.util.List;

@RestController
@RequestMapping("/api/redis")
@RequiredArgsConstructor
@Tag(name = "Redis Operations", description = "Real-time operations, caching, and leaderboard endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class RedisController {
    
    private final RedisService redisService;
    
    // ==================== Online Users ====================
    
    @GetMapping("/online-users")
    @Operation(
        summary = "Get online users",
        description = "Get list of all currently online users"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Online users retrieved successfully"
        )
    })
    public ResponseEntity<?> getOnlineUsers() {
        List<Integer> onlineUsers = redisService.getOnlineUsers();
        return ResponseEntity.ok(ApiResponse.success(
            "Online users retrieved successfully",
            onlineUsers
        ));
    }
    
    @GetMapping("/online-users/count")
    @Operation(
        summary = "Get online users count",
        description = "Get the count of currently online users"
    )
    public ResponseEntity<?> getOnlineUsersCount() {
        int count = redisService.getOnlineUsersCount();
        return ResponseEntity.ok(ApiResponse.success(
            "Online users count retrieved successfully",
            count
        ));
    }
    
    @PostMapping("/online-users/{userId}/heartbeat")
    @Operation(
        summary = "User heartbeat",
        description = "Keep user's online status alive"
    )
    public ResponseEntity<?> heartbeat(
            @Parameter(description = "User ID", example = "1")
            @PathVariable int userId) {
        redisService.refreshOnlineStatus(userId);
        return ResponseEntity.ok(ApiResponse.success(
            "Heartbeat received",
            null
        ));
    }
    
    @GetMapping("/online-users/{userId}/status")
    @Operation(
        summary = "Check if user is online",
        description = "Check the online status of a specific user"
    )
    public ResponseEntity<?> isUserOnline(
            @Parameter(description = "User ID", example = "1")
            @PathVariable int userId) {
        boolean isOnline = redisService.isUserOnline(userId);
        return ResponseEntity.ok(ApiResponse.success(
            "User status retrieved",
            isOnline
        ));
    }
    
    // ==================== Leaderboard ====================
    
    @GetMapping("/leaderboard")
    @Operation(
        summary = "Get leaderboard",
        description = "Get top players from the leaderboard"
    )
    public ResponseEntity<?> getLeaderboard(
            @Parameter(description = "Number of top players to retrieve", example = "10")
            @RequestParam(defaultValue = "10") int limit) {
        List<Integer> topPlayers = redisService.getTopPlayers(limit);
        return ResponseEntity.ok(ApiResponse.success(
            "Leaderboard retrieved successfully",
            topPlayers
        ));
    }
    
    @GetMapping("/leaderboard/user/{userId}")
    @Operation(
        summary = "Get user rank and score",
        description = "Get user's rank and score from leaderboard"
    )
    public ResponseEntity<?> getUserRankAndScore(
            @Parameter(description = "User ID", example = "1")
            @PathVariable int userId) {
        long rank = redisService.getUserRank(userId);
        double score = redisService.getUserScore(userId);
        
        var data = new java.util.HashMap<String, Object>();
        data.put("userId", userId);
        data.put("rank", rank);
        data.put("score", score);
        
        return ResponseEntity.ok(ApiResponse.success(
            "User rank and score retrieved successfully",
            data
        ));
    }
    
    // ==================== Matchmaking ====================
    
    @PostMapping("/matchmaking/join/{userId}")
    @Operation(
        summary = "Join matchmaking queue",
        description = "Add user to the matchmaking queue"
    )
    public ResponseEntity<?> joinQueue(
            @Parameter(description = "User ID", example = "1")
            @PathVariable int userId) {
        try {
            redisService.joinMatchQueue(userId);
            return ResponseEntity.ok(ApiResponse.success(
                "Joined matchmaking queue",
                null
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/matchmaking/leave/{userId}")
    @Operation(
        summary = "Leave matchmaking queue",
        description = "Remove user from the matchmaking queue"
    )
    public ResponseEntity<?> leaveQueue(
            @Parameter(description = "User ID", example = "1")
            @PathVariable int userId) {
        redisService.leaveMatchQueue(userId);
        return ResponseEntity.ok(ApiResponse.success(
            "Left matchmaking queue",
            null
        ));
    }
    
    @GetMapping("/matchmaking/queue")
    @Operation(
        summary = "Get matchmaking queue",
        description = "Get list of users waiting in matchmaking queue"
    )
    public ResponseEntity<?> getQueue() {
        List<Integer> queue = redisService.getWaitingPlayers(100);
        return ResponseEntity.ok(ApiResponse.success(
            "Queue retrieved successfully",
            queue
        ));
    }
    
    @GetMapping("/matchmaking/queue/size")
    @Operation(
        summary = "Get queue size",
        description = "Get the number of users waiting in matchmaking queue"
    )
    public ResponseEntity<?> getQueueSize() {
        long size = redisService.getQueueSize();
        return ResponseEntity.ok(ApiResponse.success(
            "Queue size retrieved successfully",
            size
        ));
    }
    
    // ==================== Active Matches ====================
    
    @GetMapping("/matches/{matchId}/players")
    @Operation(
        summary = "Get match players",
        description = "Get list of players in an active match"
    )
    public ResponseEntity<?> getMatchPlayers(
            @Parameter(description = "Match ID", example = "1")
            @PathVariable int matchId) {
        List<Integer> players = redisService.getMatchPlayers(matchId);
        return ResponseEntity.ok(ApiResponse.success(
            "Match players retrieved successfully",
            players
        ));
    }
    
    @GetMapping("/users/{userId}/current-match")
    @Operation(
        summary = "Get user's current match",
        description = "Get the match ID of user's current active match"
    )
    public ResponseEntity<?> getUserCurrentMatch(
            @Parameter(description = "User ID", example = "1")
            @PathVariable int userId) {
        var currentMatch = redisService.getUserCurrentMatch(userId);
        
        if (currentMatch.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success(
                "User is in match",
                currentMatch.get()
            ));
        } else {
            return ResponseEntity.ok(ApiResponse.success(
                "User is not in any match",
                null
            ));
        }
    }
    
    // ==================== System Stats ====================
    
    @GetMapping("/stats")
    @Operation(
        summary = "Get system statistics",
        description = "Get real-time system statistics including online users and queue size"
    )
    public ResponseEntity<?> getSystemStats() {
        RedisService.SystemStats stats = redisService.getSystemStats();
        return ResponseEntity.ok(ApiResponse.success(
            "System stats retrieved successfully",
            stats
        ));
    }
    
    // ==================== Cache Management ====================
    
    @DeleteMapping("/cache/user/{userId}")
    @Operation(
        summary = "Clear user cache",
        description = "Invalidate cache for a specific user"
    )
    public ResponseEntity<?> clearUserCache(
            @Parameter(description = "User ID", example = "1")
            @PathVariable int userId) {
        redisService.invalidateUserCache(userId);
        return ResponseEntity.ok(ApiResponse.success(
            "User cache cleared successfully",
            null
        ));
    }
    
    @DeleteMapping("/cache/match/{matchId}")
    @Operation(
        summary = "Clear match cache",
        description = "Invalidate cache for a specific match"
    )
    public ResponseEntity<?> clearMatchCache(
            @Parameter(description = "Match ID", example = "1")
            @PathVariable int matchId) {
        redisService.invalidateMatchCache(matchId);
        return ResponseEntity.ok(ApiResponse.success(
            "Match cache cleared successfully",
            null
        ));
    }
}
