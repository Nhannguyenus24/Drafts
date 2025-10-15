package realtime.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User statistics for leaderboard")
public class UserStatsDTO {
    
    @Schema(description = "User ID", example = "1")
    private int userId;
    
    @Schema(description = "Username", example = "john_doe")
    private String username;
    
    @Schema(description = "Total number of matches played", example = "150")
    private int totalMatches;
    
    @Schema(description = "Total number of wins", example = "95")
    private int totalWins;
    
    @Schema(description = "Total number of losses", example = "55")
    private int totalLosses;
    
    @Schema(description = "Win rate percentage", example = "63.33")
    private double winRate;
    
    @Schema(description = "Rank position", example = "5")
    private int rank;
    
    @Schema(description = "Score/Points", example = "9500")
    private double score;
}
