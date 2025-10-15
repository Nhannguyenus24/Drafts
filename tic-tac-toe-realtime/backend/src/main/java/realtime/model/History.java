package realtime.model;

import lombok.*;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class History {
    private int historyId;
    private int userId;
    private List<Integer> matchIds;
    private List<Boolean> isWin;
}
