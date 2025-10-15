package realtime.repository;

import realtime.model.*;
import realtime.dto.UserStatsDTO;
import java.util.List;

public interface IRepository {
    //user
    int userRegister(String username, String password);
    int userLogin(String username, String password);
    User getUserById(int id);
    User getUserByUsername(String username);

    //match
    Match getMatchById(int id);

    //history
    History getHistoryByUserId(int userId);
    History updateHistory(Integer matchId, boolean isWinner);

    //ranking
    List<User> getTopHighScoreUsers();
    List<Match> getTopWinRateUsers();
    
    //statistics for leaderboard
    List<UserStatsDTO> getTop100ByWins();
    List<UserStatsDTO> getTop100ByMatchesPlayed();
    List<UserStatsDTO> getTop100ByWinRate(int minimumMatches);
    int getTotalUsersCount();
}
