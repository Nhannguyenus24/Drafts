package realtime.model;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Match {
    private int matchId;
    private int player1;
    private int player2;
    private List<Move> moves;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
