-- MySQL Database Schema for Realtime Application

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
    match_id INT AUTO_INCREMENT PRIMARY KEY,
    player1 INT NOT NULL,
    player2 INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    FOREIGN KEY (player1) REFERENCES users(user_id),
    FOREIGN KEY (player2) REFERENCES users(user_id)
);

-- Moves table
CREATE TABLE IF NOT EXISTS moves (
    move_id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT NOT NULL,
    player_id INT NOT NULL,
    x INT NOT NULL,
    y INT NOT NULL,
    time BIGINT NOT NULL,
    FOREIGN KEY (match_id) REFERENCES matches(match_id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES users(user_id)
);

-- History table (stores match history for each user)
CREATE TABLE IF NOT EXISTS history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    match_ids TEXT,  -- Comma-separated list of match IDs
    is_win TEXT,     -- Comma-separated list of 0 (loss) and 1 (win)
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX idx_matches_player1 ON matches(player1);
CREATE INDEX idx_matches_player2 ON matches(player2);
CREATE INDEX idx_moves_match_id ON moves(match_id);
CREATE INDEX idx_moves_player_id ON moves(player_id);
CREATE INDEX idx_history_user_id ON history(user_id);
