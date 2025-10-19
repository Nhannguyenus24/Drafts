# 🎮 Odd vs Even - Real-time Tic-Tac-Toe

A real-time multiplayer game where two players compete to create lines of odd or even numbers on a 5x5 grid.

## 🎯 Game Rules

- **5x5 Board**: 25 squares arranged in a grid
- **Two Players**: 
  - **ODD Player** 🔵: Wins by creating 5 odd numbers in a line
  - **EVEN Player** 🟢: Wins by creating 5 even numbers in a line
- **Click to Increment**: Each click increases the square's number by 1
- **Win Conditions**: 5 in a row (horizontal, vertical, or diagonal)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### 1. Start Backend (NestJS)
```bash
cd backend-nestjs
npm install
npm run start:dev
```

Backend will run on `http://localhost:8080`

### 2. Start Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

### 3. Play!
1. Open `http://localhost:3000` in **two browser tabs**
2. First player gets **ODD** role
3. Second player gets **EVEN** role
4. Click squares to increment numbers
5. First to create a line of 5 same-parity numbers wins!

## 🌐 Play Over LAN

### Host Setup
1. Find your IP address:
   ```bash
   ipconfig | findstr /i "IPv4"
   # Example: 192.168.1.39
   ```

2. Update `frontend/.env`:
   ```env
   VITE_WEBSOCKET_URL=http://192.168.1.39:8080
   ```

3. Allow firewall (Windows PowerShell as Admin):
   ```powershell
   New-NetFirewallRule -DisplayName "Tic Tac Toe Backend" -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow
   New-NetFirewallRule -DisplayName "Tic Tac Toe Frontend" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
   ```

4. Start backend and frontend (see Quick Start)

### Join from Another Device
Open browser and go to:
```
http://192.168.1.39:3000
```
(Replace `192.168.1.39` with host's IP)

## ✨ Features

### ⚡ Real-time Multiplayer
- **WebSocket Connection**: Instant synchronization via Socket.IO
- **Auto Reconnect**: Handles disconnections gracefully
- **Optimistic Updates**: Smooth gameplay with pending state

### 🎨 Beautiful UI
- **Dark Theme**: Modern glassmorphism design
- **Neon Accents**: Cyan for ODD, Green for EVEN
- **Animations**: Glowing effects and smooth transitions
- **Responsive**: Works on desktop and mobile

### 🔄 Rematch System
- **Vote to Replay**: Both players must agree to rematch
- **Role Swap**: Players swap roles each game for fairness
- **Visual Feedback**: Shows who's ready for rematch

### 🏆 Win Detection
- **5 Lines**: Rows, columns, and diagonals
- **Visual Board**: See the winning line in game over modal
- **Golden Glow**: Winning squares highlighted with animation

### 🔧 Technical Features
- **Server Authority**: Single source of truth for game state
- **Operational Transform**: Handles concurrent moves correctly
- **No Race Conditions**: Vote system prevents premature restarts
- **Clean State Management**: Proper game reset on disconnect

## 📁 Project Structure

```
.
├── backend-nestjs/          # NestJS + Socket.IO server
│   ├── src/
│   │   ├── game/
│   │   │   ├── game.gateway.ts      # WebSocket gateway
│   │   │   ├── game.service.ts      # Game logic
│   │   │   └── interfaces/          # TypeScript interfaces
│   │   └── main.ts                  # Entry point
│   └── package.json
│
├── frontend/                # React + Vite client
│   ├── src/
│   │   ├── components/
│   │   │   ├── GameBoard.jsx        # 5x5 grid
│   │   │   ├── GameOverModal.jsx    # Win/loss popup
│   │   │   └── StatusBar.jsx        # Connection status
│   │   ├── hooks/
│   │   │   └── useWebSocket.js      # Socket.IO hook
│   │   ├── App.jsx                  # Main app
│   │   └── index.css                # Styles
│   └── package.json
│
└── README.md                # This file
```

## 🎮 How to Play

### Starting the Game
1. Player 1 connects → Sees "Waiting for opponent..."
2. Player 2 connects → Game starts immediately!

### During the Game
- **Click any square** to increase its number by 1
- Numbers start at 0 (even)
- Click once → 1 (odd)
- Click twice → 2 (even)
- Click three times → 3 (odd)
- And so on...

### Winning
Create **5 numbers of the same parity** in a line:
- Horizontal: `[1, 3, 5, 7, 9]` ← All odd = ODD wins
- Vertical: `[2, 4, 6, 8, 10]` ← All even = EVEN wins
- Diagonal: Works too!

### After Game Ends
1. Winner sees: "You Won! 🎉"
2. Loser sees: "You Lost 😢"
3. Both see mini board with winning line highlighted
4. Click "Play Again" to request rematch
5. When both players click → New game starts with swapped roles!

## 🛠️ Tech Stack

### Backend
- **NestJS** - Node.js framework
- **Socket.IO** - WebSocket library
- **TypeScript** - Type safety

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Socket.IO Client** - WebSocket client

## 📝 Development

### Backend Development
```bash
cd backend-nestjs
npm run start:dev    # Hot reload
npm run build        # Production build
```

### Frontend Development
```bash
cd frontend
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
```
