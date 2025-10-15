DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    user_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    is_user BOOLEAN NOT NULL,
    conversation_id INT NOT NULL,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

INSERT INTO users (id, name, email, password) VALUES
    (1, 'Alice', 'alice@example.com', 'alice123'),
    (2, 'Bob', 'bob@example.com', 'bob123'),
    (3, 'Charlie', 'charlie@example.com', 'charlie123');

INSERT INTO conversations (name, user_id, created_at) VALUES
    ('Alice Chat 1', 1, '2025-06-10 10:00:00'),
    ('Bob Chat 1', 2, '2025-06-10 11:00:00'),
    ('Alice Chat 2', 1, '2025-06-11 09:30:00');

INSERT INTO messages (content, timestamp, is_user, conversation_id) VALUES
    ('Hi, how are you?', '2025-06-10 10:01:00', true, 1),
    ('I am fine, thanks!', '2025-06-10 10:01:30', false, 1),
    ('Hello there!', '2025-06-10 11:02:00', true, 2),
    ('Good morning!', '2025-06-11 09:31:00', true, 3),
    ('Morning! How can I help you?', '2025-06-11 09:31:30', false, 3);