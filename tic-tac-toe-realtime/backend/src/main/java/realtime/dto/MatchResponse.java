package realtime.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import realtime.model.Match;
import realtime.model.Move;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Match details response")
public class MatchResponse {
    
    @Schema(description = "Match ID", example = "1")
    private int matchId;
    
    @Schema(description = "Player 1 user ID", example = "1")
    private int player1;
    
    @Schema(description = "Player 2 user ID", example = "2")
    private int player2;
    
    @Schema(description = "List of moves in the match")
    private List<Move> moves;
    
    @Schema(description = "Match start time", example = "2025-10-15T14:30:00")
    private LocalDateTime startTime;
    
    @Schema(description = "Match end time", example = "2025-10-15T14:45:00")
    private LocalDateTime endTime;
    
    @Schema(description = "Match status", example = "completed")
    private String status;
    
    @Schema(description = "Total number of moves", example = "25")
    private int totalMoves;
    
    public static MatchResponse fromMatch(Match match) {
        MatchResponse response = new MatchResponse();
        response.setMatchId(match.getMatchId());
        response.setPlayer1(match.getPlayer1());
        response.setPlayer2(match.getPlayer2());
        response.setMoves(match.getMoves());
        response.setStartTime(match.getStartTime());
        response.setEndTime(match.getEndTime());
        
        String status = match.getEndTime() != null ? "completed" : "in_progress";
        response.setStatus(status);
        
        int totalMoves = match.getMoves() != null ? match.getMoves().size() : 0;
        response.setTotalMoves(totalMoves);
        
        return response;
    }
}
