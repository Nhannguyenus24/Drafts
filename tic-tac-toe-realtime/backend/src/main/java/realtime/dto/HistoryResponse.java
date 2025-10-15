package realtime.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import realtime.model.History;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User match history response")
public class HistoryResponse {
    
    @Schema(description = "History ID", example = "1")
    private int historyId;
    
    @Schema(description = "User ID", example = "1")
    private int userId;
    
    @Schema(description = "List of match IDs", example = "[1, 2, 3, 4, 5]")
    private List<Integer> matchIds;
    
    @Schema(description = "List of win/loss results", example = "[true, false, true, true, false]")
    private List<Boolean> isWin;
    
    @Schema(description = "Total number of matches played", example = "5")
    private int totalMatches;
    
    @Schema(description = "Total number of wins", example = "3")
    private int totalWins;
    
    @Schema(description = "Total number of losses", example = "2")
    private int totalLosses;
    
    @Schema(description = "Win rate percentage", example = "60.0")
    private double winRate;
    
    public static HistoryResponse fromHistory(History history) {
        HistoryResponse response = new HistoryResponse();
        response.setHistoryId(history.getHistoryId());
        response.setUserId(history.getUserId());
        response.setMatchIds(history.getMatchIds());
        response.setIsWin(history.getIsWin());
        
        int totalMatches = history.getIsWin() != null ? history.getIsWin().size() : 0;
        int totalWins = history.getIsWin() != null ? 
                (int) history.getIsWin().stream().filter(Boolean::booleanValue).count() : 0;
        int totalLosses = totalMatches - totalWins;
        double winRate = totalMatches > 0 ? (totalWins * 100.0 / totalMatches) : 0.0;
        
        response.setTotalMatches(totalMatches);
        response.setTotalWins(totalWins);
        response.setTotalLosses(totalLosses);
        response.setWinRate(winRate);
        
        return response;
    }
}
