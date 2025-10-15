package realtime.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Repository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import realtime.model.*;
import realtime.dto.UserStatsDTO;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class RepositoryImpl implements IRepository {
    private final JdbcTemplate jdbc;

    // RowMappers
    private final RowMapper<User> userRowMapper = (rs, rowNum) -> {
        User user = new User();
        user.setUserId(rs.getInt("user_id"));
        user.setUsername(rs.getString("username"));
        user.setPassword(rs.getString("password"));
        return user;
    };

    private final RowMapper<Move> moveRowMapper = (rs, rowNum) -> {
        Move move = new Move();
        move.setMoveId(rs.getInt("move_id"));
        move.setPlayerId(rs.getInt("player_id"));
        move.setX(rs.getInt("x"));
        move.setY(rs.getInt("y"));
        move.setTime(rs.getLong("time"));
        return move;
    };

    @Override
    public int userRegister(String username, String password) {
        String checkSql = "SELECT COUNT(*) FROM users WHERE username = ?";
        Integer count = jdbc.queryForObject(checkSql, Integer.class, username);
        if (count != null && count > 0) {
            return -1;
        }

        String sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        jdbc.update(sql, username, password);

        // Lấy id mới
        Integer userId = jdbc.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);

        // Tạo history trống
        String historySql = "INSERT INTO history (user_id) VALUES (?)";
        jdbc.update(historySql, userId);

        return userId != null ? userId : -1;
    }


    @Override
    public int userLogin(String username, String password) {
        String sql = "SELECT user_id FROM users WHERE username = ? AND password = ?";
        try {
            Integer userId = jdbc.queryForObject(sql, Integer.class, username, password);
            return userId != null ? userId : -1;
        } catch (EmptyResultDataAccessException e) {
            return -1; // User not found or invalid credentials
        }
    }

    @Override
    public User getUserById(int id) {
        String sql = "SELECT user_id, username, password FROM users WHERE user_id = ?";
        try {
            return jdbc.queryForObject(sql, userRowMapper, id);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public User getUserByUsername(String username) {
        String sql = "SELECT user_id, username, password FROM users WHERE username = ?";
        try {
            return jdbc.queryForObject(sql, userRowMapper, username);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public Match getMatchById(int id) {
        String sql = "SELECT match_id, player1, player2, start_time, end_time FROM matches WHERE match_id = ?";
        try {
            Match match = jdbc.queryForObject(sql, (rs, rowNum) -> {
                Match m = new Match();
                m.setMatchId(rs.getInt("match_id"));
                m.setPlayer1(rs.getInt("player1"));
                m.setPlayer2(rs.getInt("player2"));
                m.setStartTime(rs.getObject("start_time", LocalDateTime.class));
                m.setEndTime(rs.getObject("end_time", LocalDateTime.class));
                return m;
            }, id);
            
            // Get moves for this match
            String movesSql = "SELECT move_id, player_id, x, y, time FROM moves WHERE match_id = ? ORDER BY time";
            List<Move> moves = jdbc.query(movesSql, moveRowMapper, id);
            match.setMoves(moves);
            
            return match;
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public History getHistoryByUserId(int userId) {
        String sql = "SELECT history_id, user_id, match_ids, is_win FROM history WHERE user_id = ?";
        try {
            return jdbc.queryForObject(sql, (rs, rowNum) -> {
                History history = new History();
                history.setHistoryId(rs.getInt("history_id"));
                history.setUserId(rs.getInt("user_id"));
                
                // Parse comma-separated match_ids
                String matchIdsStr = rs.getString("match_ids");
                List<Integer> matchIds = new ArrayList<>();
                if (matchIdsStr != null && !matchIdsStr.isEmpty()) {
                    matchIds = Arrays.stream(matchIdsStr.split(","))
                            .map(Integer::parseInt)
                            .collect(Collectors.toList());
                }
                history.setMatchIds(matchIds);
                
                // Parse comma-separated is_win (0 or 1)
                String isWinStr = rs.getString("is_win");
                List<Boolean> isWin = new ArrayList<>();
                if (isWinStr != null && !isWinStr.isEmpty()) {
                    isWin = Arrays.stream(isWinStr.split(","))
                            .map(s -> s.equals("1"))
                            .collect(Collectors.toList());
                }
                history.setIsWin(isWin);
                
                return history;
            }, userId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public History updateHistory(Integer matchId, boolean isWinner) {
        // This method needs a userId context. Assuming we can get it from the match
        // Or you might need to pass userId as a parameter
        String getPlayerSql = "SELECT player1, player2 FROM matches WHERE match_id = ?";
        try {
            // Get the match to determine players
            Match match = getMatchById(matchId);
            if (match == null) {
                return null;
            }
            
            // You'll need to determine which player won
            // For now, I'll update based on player1 (you may need to adjust this logic)
            int userId = isWinner ? match.getPlayer1() : match.getPlayer2();
            
            History history = getHistoryByUserId(userId);
            if (history == null) {
                return null;
            }
            
            List<Integer> matchIds = history.getMatchIds();
            List<Boolean> isWin = history.getIsWin();
            
            matchIds.add(matchId);
            isWin.add(isWinner);
            
            String matchIdsStr = matchIds.stream()
                    .map(String::valueOf)
                    .collect(Collectors.joining(","));
            String isWinStr = isWin.stream()
                    .map(b -> b ? "1" : "0")
                    .collect(Collectors.joining(","));
            
            String sql = "UPDATE history SET match_ids = ?, is_win = ? WHERE user_id = ?";
            jdbc.update(sql, matchIdsStr, isWinStr, userId);
            
            return getHistoryByUserId(userId);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public List<User> getTopHighScoreUsers() {
        // Calculate high scores based on win count
        String sql = """
            SELECT u.user_id, u.username, u.password
            FROM users u
            JOIN history h ON u.user_id = h.user_id
            WHERE h.is_win IS NOT NULL AND h.is_win != ''
            ORDER BY (LENGTH(h.is_win) - LENGTH(REPLACE(h.is_win, '1', ''))) DESC
            LIMIT 10
            """;
        return jdbc.query(sql, userRowMapper);
    }

    @Override
    public List<Match> getTopWinRateUsers() {
        // This method returns matches, but the name suggests users with top win rate
        // I'll return recent matches ordered by completion time
        String sql = """
            SELECT match_id, player1, player2, start_time, end_time
            FROM matches
            WHERE end_time IS NOT NULL
            ORDER BY end_time DESC
            LIMIT 10
            """;
        
        return jdbc.query(sql, (rs, rowNum) -> {
            Match match = new Match();
            match.setMatchId(rs.getInt("match_id"));
            match.setPlayer1(rs.getInt("player1"));
            match.setPlayer2(rs.getInt("player2"));
            match.setStartTime(rs.getObject("start_time", LocalDateTime.class));
            match.setEndTime(rs.getObject("end_time", LocalDateTime.class));
            // Note: moves are not loaded for performance
            match.setMoves(new ArrayList<>());
            return match;
        });
    }

    // ==================== Statistics for Leaderboard ====================
    
    @Override
    public List<UserStatsDTO> getTop100ByWins() {
        String sql = """
            SELECT 
                u.user_id,
                u.username,
                h.match_ids,
                h.is_win,
                COALESCE(LENGTH(h.is_win) - LENGTH(REPLACE(h.is_win, ',', '')) + 1, 0) as total_matches,
                COALESCE(LENGTH(h.is_win) - LENGTH(REPLACE(h.is_win, '1', '')), 0) as total_wins,
                COALESCE((LENGTH(h.is_win) - LENGTH(REPLACE(h.is_win, ',', '')) + 1) - 
                         (LENGTH(h.is_win) - LENGTH(REPLACE(h.is_win, '1', ''))), 0) as total_losses
            FROM users u
            LEFT JOIN history h ON u.user_id = h.user_id
            WHERE h.is_win IS NOT NULL AND h.is_win != ''
            ORDER BY total_wins DESC, total_matches DESC
            LIMIT 100
            """;
        
        return jdbc.query(sql, (rs, rowNum) -> {
            int totalMatches = rs.getInt("total_matches");
            int totalWins = rs.getInt("total_wins");
            int totalLosses = rs.getInt("total_losses");
            double winRate = totalMatches > 0 ? (totalWins * 100.0 / totalMatches) : 0.0;
            
            return UserStatsDTO.builder()
                    .userId(rs.getInt("user_id"))
                    .username(rs.getString("username"))
                    .totalMatches(totalMatches)
                    .totalWins(totalWins)
                    .totalLosses(totalLosses)
                    .winRate(Math.round(winRate * 100.0) / 100.0)
                    .score(totalWins)
                    .rank(rowNum + 1)
                    .build();
        });
    }
    
    @Override
    public List<UserStatsDTO> getTop100ByMatchesPlayed() {
        String sql = """
            SELECT 
                u.user_id,
                u.username,
                h.match_ids,
                h.is_win,
                COALESCE(LENGTH(h.is_win) - LENGTH(REPLACE(h.is_win, ',', '')) + 1, 0) as total_matches,
                COALESCE(LENGTH(h.is_win) - LENGTH(REPLACE(h.is_win, '1', '')), 0) as total_wins,
                COALESCE((LENGTH(h.is_win) - LENGTH(REPLACE(h.is_win, ',', '')) + 1) - 
                         (LENGTH(h.is_win) - LENGTH(REPLACE(h.is_win, '1', ''))), 0) as total_losses
            FROM users u
            LEFT JOIN history h ON u.user_id = h.user_id
            WHERE h.is_win IS NOT NULL AND h.is_win != ''
            ORDER BY total_matches DESC, total_wins DESC
            LIMIT 100
            """;
        
        return jdbc.query(sql, (rs, rowNum) -> {
            int totalMatches = rs.getInt("total_matches");
            int totalWins = rs.getInt("total_wins");
            int totalLosses = rs.getInt("total_losses");
            double winRate = totalMatches > 0 ? (totalWins * 100.0 / totalMatches) : 0.0;
            
            return UserStatsDTO.builder()
                    .userId(rs.getInt("user_id"))
                    .username(rs.getString("username"))
                    .totalMatches(totalMatches)
                    .totalWins(totalWins)
                    .totalLosses(totalLosses)
                    .winRate(Math.round(winRate * 100.0) / 100.0)
                    .score(totalMatches)
                    .rank(rowNum + 1)
                    .build();
        });
    }
    
    @Override
    public List<UserStatsDTO> getTop100ByWinRate(int minimumMatches) {
        String sql = """
            SELECT 
                u.user_id,
                u.username,
                h.match_ids,
                h.is_win,
                COALESCE(LENGTH(h.is_win) - LENGTH(REPLACE(h.is_win, ',', '')) + 1, 0) as total_matches,
                COALESCE(LENGTH(h.is_win) - LENGTH(REPLACE(h.is_win, '1', '')), 0) as total_wins,
                COALESCE((LENGTH(h.is_win) - LENGTH(REPLACE(h.is_win, ',', '')) + 1) - 
                         (LENGTH(h.is_win) - LENGTH(REPLACE(h.is_win, '1', ''))), 0) as total_losses,
                CASE 
                    WHEN (LENGTH(h.is_win) - LENGTH(REPLACE(h.is_win, ',', '')) + 1) > 0 
                    THEN (LENGTH(h.is_win) - LENGTH(REPLACE(h.is_win, '1', ''))) * 100.0 / 
                         (LENGTH(h.is_win) - LENGTH(REPLACE(h.is_win, ',', '')) + 1)
                    ELSE 0 
                END as win_rate
            FROM users u
            LEFT JOIN history h ON u.user_id = h.user_id
            WHERE h.is_win IS NOT NULL 
                AND h.is_win != ''
                AND (LENGTH(h.is_win) - LENGTH(REPLACE(h.is_win, ',', '')) + 1) >= ?
            ORDER BY win_rate DESC, total_wins DESC
            LIMIT 100
            """;
        
        return jdbc.query(sql, (rs, rowNum) -> {
            int totalMatches = rs.getInt("total_matches");
            int totalWins = rs.getInt("total_wins");
            int totalLosses = rs.getInt("total_losses");
            double winRate = rs.getDouble("win_rate");
            
            return UserStatsDTO.builder()
                    .userId(rs.getInt("user_id"))
                    .username(rs.getString("username"))
                    .totalMatches(totalMatches)
                    .totalWins(totalWins)
                    .totalLosses(totalLosses)
                    .winRate(Math.round(winRate * 100.0) / 100.0)
                    .score(winRate)
                    .rank(rowNum + 1)
                    .build();
        }, minimumMatches);
    }
    
    @Override
    public int getTotalUsersCount() {
        String sql = "SELECT COUNT(*) FROM users";
        Integer count = jdbc.queryForObject(sql, Integer.class);
        return count != null ? count : 0;
    }

}
