package realtime.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Daily leaderboard containing top players")
public class DailyLeaderboardDTO {
    
    @Schema(description = "Top 100 players by total wins")
    private List<UserStatsDTO> topByWins;
    
    @Schema(description = "Top 100 players by total matches played")
    private List<UserStatsDTO> topByMatchesPlayed;
    
    @Schema(description = "Top 100 players by win rate (minimum 10 matches)")
    private List<UserStatsDTO> topByWinRate;
    
    @Schema(description = "Last update timestamp")
    private LocalDateTime lastUpdated;
    
    @Schema(description = "Total users in database")
    private int totalUsers;
}
