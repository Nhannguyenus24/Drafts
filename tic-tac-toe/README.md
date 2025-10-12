# Tic-Tac-Toe Game

A modern, responsive Tic-Tac-Toe game built with React and Material-UI featuring multiple game modes including AI opponents with different difficulty levels.

## 🎮 Features

### Game Modes
- **Player vs Easy Bot**: Play against a random-move AI
- **Player vs Hard Bot**: Challenge an unbeatable AI using minimax with alpha-beta pruning
- **Bot vs Bot**: Watch two AI opponents battle it out with auto-play feature

### AI Intelligence
- **Easy Bot**: Makes random moves for casual gameplay
- **Hard Bot**: Uses minimax algorithm with alpha-beta pruning - mathematically unbeatable, will either win or draw, never lose

### User Interface
- **Material-UI Design**: Modern, clean interface with beautiful animations
- **Responsive Layout**: Works perfectly on desktop, tablet
- **Winning Line Highlighting**: Visual indication of winning combinations

### Additional Features
- **Alpha-Beta Tree Visualization**: Watch the AI's decision-making process
- **Mini Board Display**: See the game state when AI calculates
- **Auto-play Mode**: For Bot vs Bot games, automatically start new games
- **Game Statistics**: Track total games played and draw count
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance Optimized**: Smooth animations and responsive interactions

## 🚀 Quick Start

### Prerequisites
- Node.js 16 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tic-tac-toe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🐳 Docker Setup

### Using Docker Compose (Recommended)

1. **Run in production mode**
   ```bash
   docker-compose up --build
   ```

2. **Run in development mode**
   ```bash
   docker-compose --profile dev up --build
   ```

### Using Docker directly

1. **Build the image**
   ```bash
   docker build -t tic-tac-toe .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 tic-tac-toe
   ```

## 🎯 How to Play

### Game Rules
1. The game is played on a 3×3 grid
2. Players take turns placing their marks (X or O)
3. The first player to get 3 marks in a row (horizontally, vertically, or diagonally) wins
4. If all 9 squares are filled and no player has 3 in a row, the game is a draw

### Game Modes Explained

#### Player vs Easy Bot
- You play as X, bot plays as O
- Bot makes random moves
- Good for beginners or casual play

#### Player vs Hard Bot
- You play as X, bot plays as O
- Bot uses advanced minimax algorithm with alpha-beta pruning
- **The bot is unbeatable** - it will either win or force a draw
- **Alpha-Beta Tree Visualization**: After the game ends, see how the AI made its decision
- Great for testing your skills against perfect play and learning AI algorithms

#### Bot vs Bot
- Watch two hard bots play against each other
- Demonstrates that perfect play always results in a draw
- Use auto-play to continuously watch games
- Educational tool to understand optimal tic-tac-toe strategy

## 🧠 AI Algorithm Details

### Minimax with Alpha-Beta Pruning

The hard bot uses the minimax algorithm, a decision-making algorithm for turn-based games:

- **Minimax**: Evaluates all possible game states to find the optimal move
- **Alpha-Beta Pruning**: Optimization that eliminates unnecessary branches, making the algorithm faster
- **Evaluation Function**: 
  - +10 for AI wins (adjusted by depth for faster wins)
  - -10 for human wins (adjusted by depth for slower losses)
  - 0 for draws

## 🏗️ Project Structure

```
src/
├── App.jsx           # Main game component with state management
├── components/
│   ├── Board.jsx     # Game board with 3x3 grid
│   ├── Square.jsx    # Individual clickable squares
│   └── GameInfo.jsx  # Score display, controls, and game status
├── utils/
│   ├── gameLogic.js  # Core game logic and win detection
│   └── ai.js         # AI algorithms (random and minimax)
└── App.css           # Custom styles and responsive design
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Technology Stack

- **React 18** - UI framework
- **Material-UI (MUI)** - Component library and theming
- **Vite** - Build tool and development server
- **JavaScript (ES6+)** - Programming language

### Key Dependencies

- `@mui/material` - Material-UI components
- `@mui/icons-material` - Material-UI icons
- `@emotion/react` & `@emotion/styled` - CSS-in-JS styling

## 🎨 Customization

### Themes
The game uses Material-UI's theming system. You can customize colors, fonts, and spacing by modifying the theme object in `App.jsx`.

### AI Difficulty
- Modify `ai.js` to adjust AI behavior
- Easy bot: Uses `getRandomMove()`
- Hard bot: Uses `getBestMove()` with minimax

### Game Logic
- All game rules are in `gameLogic.js`
- Easily extendable for larger boards or different win conditions

## 📄 License

This project is open source and available under the [MIT License](LICENSE).