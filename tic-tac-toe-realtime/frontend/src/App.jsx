import { useState, useEffect, useRef } from 'react'
import GameBoard from './components/GameBoard'
import StatusBar from './components/StatusBar'
import GameOverModal from './components/GameOverModal'
import useWebSocket from './hooks/useWebSocket'

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:8080'

function App() {
  const [board, setBoard] = useState(Array(25).fill(0))
  const [playerType, setPlayerType] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState(null)
  const [winningLine, setWinningLine] = useState([])
  const [pendingSquares, setPendingSquares] = useState(new Set())
  const [rematchStatus, setRematchStatus] = useState(null) // 'waiting' | 'requested' | null

  // WebSocket connection
  const { sendMessage, isConnected } = useWebSocket({
    url: WEBSOCKET_URL,
    onMessage: handleMessage,
    onConnect: handleConnect,
    onDisconnect: handleDisconnect,
  })

  function handleConnect() {
    setConnectionStatus('connected')
  }

  function handleDisconnect() {
    setConnectionStatus('disconnected')
  }

  function handleMessage(message) {
    console.log('Received message:', message)

    switch (message.type) {
      case 'PLAYER_ASSIGNED':
        setPlayerType(message.player)
        setBoard(message.board || Array(25).fill(0))
        setConnectionStatus('connected')
        setGameOver(false)
        setWinningLine([]) // Clear winning line for new game
        setRematchStatus(null) // Clear rematch status on new game
        break

      case 'WAITING':
        setConnectionStatus('waiting')
        break

      case 'WAITING_FOR_REMATCH':
        setRematchStatus(message.message.includes('opponent to accept') ? 'waiting' : 'requested')
        break

      case 'UPDATE':
        handleUpdate(message)
        break

      case 'GAME_OVER':
        setGameOver(true)
        setWinner(message.winner)
        setWinningLine(message.winningLine || [])
        setRematchStatus(null) // Clear rematch status
        break

      case 'OPPONENT_DISCONNECTED':
        setGameOver(true)
        setWinner('disconnected')
        setRematchStatus(null)
        break

      case 'ERROR':
        console.error('Server error:', message.message)
        alert(message.message)
        break

      default:
        console.warn('Unknown message type:', message.type)
    }
  }

  function handleUpdate(message) {
    const { square, value } = message

    // Remove from pending
    setPendingSquares(prev => {
      const newSet = new Set(prev)
      newSet.delete(square)
      return newSet
    })

    // Update board
    setBoard(prev => {
      const newBoard = [...prev]
      newBoard[square] = value
      return newBoard
    })

    // Add visual feedback
    const squareElement = document.querySelector(`[data-square="${square}"]`)
    if (squareElement) {
      squareElement.classList.add('square-confirmed')
      setTimeout(() => {
        squareElement.classList.remove('square-confirmed')
      }, 300)
    }
  }

  function handleSquareClick(square) {
    if (gameOver) return
    if (connectionStatus !== 'connected') return
    if (!playerType) return

    // Optimistic update (optional bonus feature)
    setPendingSquares(prev => new Set(prev).add(square))

    // Send INCREMENT message
    const message = {
      type: 'INCREMENT',
      square: square,
    }

    sendMessage(message)
  }

  function handleRefresh() {
    // Send restart message to server (vote for rematch)
    sendMessage({ type: 'RESTART_GAME' })
    
    // Clear winning line immediately (optimistic)
    setWinningLine([])
    
    // Don't reset other state yet - wait for both players to vote
    // Server will send PLAYER_ASSIGNED when both players agree
  }

  const canPlay = connectionStatus === 'connected' && !gameOver

  return (
    <div className="app">
      <div className="header">
        <h1>🎮 Odd vs Even</h1>
      </div>

      <StatusBar
        playerType={playerType}
        connectionStatus={connectionStatus}
        isConnected={isConnected}
      />

      {connectionStatus === 'waiting' ? (
        <div className="waiting-message">
          Waiting for opponent to join
          <div className="waiting-spinner"></div>
        </div>
      ) : (
        <div className="game-container">
          <GameBoard
            board={board}
            onSquareClick={handleSquareClick}
            disabled={!canPlay}
            pendingSquares={pendingSquares}
            winningLine={winningLine}
          />
        </div>
      )}

      {gameOver && (
        <GameOverModal
          winner={winner}
          playerType={playerType}
          onRefresh={handleRefresh}
          rematchStatus={rematchStatus}
          board={board}
          winningLine={winningLine}
        />
      )}
    </div>
  )
}

export default App
