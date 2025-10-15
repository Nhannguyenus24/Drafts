package realtime.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import realtime.dto.HistoryResponse;
import realtime.dto.MatchResponse;
import realtime.model.History;
import realtime.model.Match;
import realtime.service.AuthService;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Game", description = "Game-related endpoints for matches and history")
@SecurityRequirement(name = "Bearer Authentication")
public class GameController {
    
    private final AuthService authService;
    
    @GetMapping("/history/{userId}")
    @Operation(
        summary = "Get user match history",
        description = "Retrieve the match history for a specific user including wins, losses, and win rate"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "History retrieved successfully",
            content = @Content(schema = @Schema(implementation = HistoryResponse.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "History not found for the specified user"
        )
    })
    public ResponseEntity<?> getHistory(
            @Parameter(description = "User ID", example = "1")
            @PathVariable int userId) {
        try {
            History history = authService.getHistory(userId);
            HistoryResponse response = HistoryResponse.fromHistory(history);
            return ResponseEntity.ok(realtime.dto.ApiResponse.success("History retrieved successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(realtime.dto.ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/match/{matchId}")
    @Operation(
        summary = "Get match details",
        description = "Retrieve detailed information about a specific match including all moves"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Match retrieved successfully",
            content = @Content(schema = @Schema(implementation = MatchResponse.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Match not found"
        )
    })
    public ResponseEntity<?> getMatch(
            @Parameter(description = "Match ID", example = "1")
            @PathVariable int matchId) {
        try {
            Match match = authService.getMatch(matchId);
            MatchResponse response = MatchResponse.fromMatch(match);
            return ResponseEntity.ok(realtime.dto.ApiResponse.success("Match retrieved successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(realtime.dto.ApiResponse.error(e.getMessage()));
        }
    }
}
