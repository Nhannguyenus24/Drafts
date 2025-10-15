package realtime.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Move {
    private int moveId;
    private int playerId;
    private int x;
    private int y;
    private Long time;
}
