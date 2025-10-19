function GameOverModal({ winner, playerType, onRefresh, rematchStatus, board, winningLine }) {
  function getWinnerText() {
    if (winner === 'disconnected') {
      return 'Opponent Disconnected'
    }

    const youWon = winner === playerType
    return youWon ? 'You Won! 🎉' : 'You Lost 😢'
  }

  function getReasonText() {
    if (winner === 'disconnected') {
      return 'Your opponent has left the game.'
    }

    const youWon = winner === playerType
    
    if (winner === 'ODD') {
      return youWon 
        ? 'You created a line of 5 odd numbers! 🔵'
        : 'Your opponent created a line of 5 odd numbers.'
    } else {
      return youWon
        ? 'You created a line of 5 even numbers! 🟢'
        : 'Your opponent created a line of 5 even numbers.'
    }
  }

  function getWinnerClass() {
    if (winner === 'ODD') return 'winner-odd'
    if (winner === 'EVEN') return 'winner-even'
    return ''
  }

  function getButtonText() {
    if (rematchStatus === 'waiting') {
      return 'Waiting for Opponent...'
    } else if (rematchStatus === 'requested') {
      return 'Opponent Wants Rematch - Click to Accept!'
    }
    return 'Play Again'
  }

  function renderMiniBoard() {
    if (winner === 'disconnected' || !board || !winningLine || winningLine.length === 0) {
      return null
    }

    return (
      <div className="mini-board-container">
        <div className="mini-board">
          {board.map((value, index) => {
            const isWinningSquare = winningLine.includes(index)
            const isOdd = value % 2 === 1
            const isEven = value % 2 === 0 && value !== 0
            
            return (
              <div
                key={index}
                className={`mini-square ${isWinningSquare ? 'winning' : ''} ${
                  isOdd ? 'odd' : isEven ? 'even' : ''
                }`}
              >
                {value !== 0 && value}
              </div>
            )
          })}
        </div>
        <div className="winning-line-indicator">
          ↑ Winning Line
        </div>
      </div>
    )
  }

  const isWaiting = rematchStatus === 'waiting'

  return (
    <div className="game-over-overlay">
      <div className="game-over-content">
        <h2 className={getWinnerClass()}>
          {getWinnerText()}
        </h2>
        
        <p className="game-reason">
          {getReasonText()}
        </p>

        {renderMiniBoard()}
        
        {rematchStatus && (
          <div className={`rematch-status ${rematchStatus}`}>
            {rematchStatus === 'waiting' && '⏳ Waiting for opponent to accept rematch...'}
            {rematchStatus === 'requested' && '🎮 Opponent wants a rematch!'}
          </div>
        )}

        <button 
          className={`refresh-button ${isWaiting ? 'disabled' : ''} ${rematchStatus === 'requested' ? 'pulse' : ''}`}
          onClick={onRefresh}
          disabled={isWaiting}
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  )
}

export default GameOverModal
