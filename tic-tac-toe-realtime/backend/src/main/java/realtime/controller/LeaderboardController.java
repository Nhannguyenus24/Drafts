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
import realtime.dto.DailyLeaderboardDTO;
import realtime.dto.UserStatsDTO;
import realtime.service.LeaderboardSchedulerService;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
@Tag(name = "Leaderboard", description = "Daily leaderboard and player statistics endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class LeaderboardController {
    
    private final LeaderboardSchedulerService leaderboardService;
    
    @GetMapping
    @Operation(
        summary = "Get complete daily leaderboard",
        description = "Get all three leaderboards: top by wins, top by matches played, and top by win rate"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Leaderboard retrieved successfully",
            content = @Content(schema = @Schema(implementation = DailyLeaderboardDTO.class))
        )
    })
    public ResponseEntity<?> getDailyLeaderboard() {
        DailyLeaderboardDTO leaderboard = leaderboardService.getCachedLeaderboard();
        return ResponseEntity.ok(ApiResponse.success(
            "Daily leaderboard retrieved successfully",
            leaderboard
        ));
    }
    
    @GetMapping("/top-by-wins")
    @Operation(
        summary = "Get top 100 players by total wins",
        description = "Retrieve the top 100 players ranked by total number of wins"
    )
    public ResponseEntity<?> getTopByWins() {
        List<UserStatsDTO> topByWins = leaderboardService.getTopByWins();
        return ResponseEntity.ok(ApiResponse.success(
            "Top players by wins retrieved successfully",
            topByWins
        ));
    }
    
    @GetMapping("/top-by-matches")
    @Operation(
        summary = "Get top 100 players by matches played",
        description = "Retrieve the top 100 players ranked by total number of matches played"
    )
    public ResponseEntity<?> getTopByMatches() {
        List<UserStatsDTO> topByMatches = leaderboardService.getTopByMatchesPlayed();
        return ResponseEntity.ok(ApiResponse.success(
            "Top players by matches played retrieved successfully",
            topByMatches
        ));
    }
    
    @GetMapping("/top-by-winrate")
    @Operation(
        summary = "Get top 100 players by win rate",
        description = "Retrieve the top 100 players ranked by win rate (minimum 10 matches required)"
    )
    public ResponseEntity<?> getTopByWinRate() {
        List<UserStatsDTO> topByWinRate = leaderboardService.getTopByWinRate();
        return ResponseEntity.ok(ApiResponse.success(
            "Top players by win rate retrieved successfully",
            topByWinRate
        ));
    }
    
    @PostMapping("/refresh")
    @Operation(
        summary = "Manually refresh leaderboard",
        description = "Trigger immediate recalculation of all leaderboards (admin only)"
    )
    public ResponseEntity<?> refreshLeaderboard() {
        DailyLeaderboardDTO leaderboard = leaderboardService.calculateLeaderboardsNow();
        return ResponseEntity.ok(ApiResponse.success(
            "Leaderboard refreshed successfully",
            leaderboard
        ));
    }
    
    @GetMapping("/info")
    @Operation(
        summary = "Get leaderboard info",
        description = "Get information about the leaderboard including last update time and status"
    )
    public ResponseEntity<?> getLeaderboardInfo() {
        LocalDateTime lastUpdate = leaderboardService.getLastUpdateTime();
        boolean needsUpdate = leaderboardService.needsUpdate();
        
        Map<String, Object> info = new HashMap<>();
        info.put("lastUpdated", lastUpdate);
        info.put("needsUpdate", needsUpdate);
        info.put("nextUpdate", "00:00:00 (midnight) Asia/Ho_Chi_Minh timezone");
        info.put("minimumMatchesForWinRate", 10);
        info.put("cacheExpiration", "24 hours");
        
        return ResponseEntity.ok(ApiResponse.success(
            "Leaderboard info retrieved successfully",
            info
        ));
    }
    
    @GetMapping("/top-by-wins/{rank}")
    @Operation(
        summary = "Get player at specific rank (by wins)",
        description = "Get the player at a specific rank position in the wins leaderboard"
    )
    public ResponseEntity<?> getPlayerAtRankByWins(
            @Parameter(description = "Rank position (1-100)", example = "1")
            @PathVariable int rank) {
        
        if (rank < 1 || rank > 100) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Rank must be between 1 and 100"));
        }
        
        List<UserStatsDTO> topByWins = leaderboardService.getTopByWins();
        
        if (rank > topByWins.size()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Rank exceeds available players"));
        }
        
        UserStatsDTO player = topByWins.get(rank - 1);
        return ResponseEntity.ok(ApiResponse.success(
            "Player at rank " + rank + " retrieved successfully",
            player
        ));
    }
    
    @GetMapping("/top-by-winrate/{rank}")
    @Operation(
        summary = "Get player at specific rank (by win rate)",
        description = "Get the player at a specific rank position in the win rate leaderboard"
    )
    public ResponseEntity<?> getPlayerAtRankByWinRate(
            @Parameter(description = "Rank position (1-100)", example = "1")
            @PathVariable int rank) {
        
        if (rank < 1 || rank > 100) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Rank must be between 1 and 100"));
        }
        
        List<UserStatsDTO> topByWinRate = leaderboardService.getTopByWinRate();
        
        if (rank > topByWinRate.size()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Rank exceeds available players"));
        }
        
        UserStatsDTO player = topByWinRate.get(rank - 1);
        return ResponseEntity.ok(ApiResponse.success(
            "Player at rank " + rank + " retrieved successfully",
            player
        ));
    }
    
    @GetMapping("/top-by-matches/{rank}")
    @Operation(
        summary = "Get player at specific rank (by matches played)",
        description = "Get the player at a specific rank position in the matches played leaderboard"
    )
    public ResponseEntity<?> getPlayerAtRankByMatches(
            @Parameter(description = "Rank position (1-100)", example = "1")
            @PathVariable int rank) {
        
        if (rank < 1 || rank > 100) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Rank must be between 1 and 100"));
        }
        
        List<UserStatsDTO> topByMatches = leaderboardService.getTopByMatchesPlayed();
        
        if (rank > topByMatches.size()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Rank exceeds available players"));
        }
        
        UserStatsDTO player = topByMatches.get(rank - 1);
        return ResponseEntity.ok(ApiResponse.success(
            "Player at rank " + rank + " retrieved successfully",
            player
        ));
    }
}
