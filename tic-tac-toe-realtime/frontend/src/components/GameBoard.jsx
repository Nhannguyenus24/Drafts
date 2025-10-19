function GameBoard({ board, onSquareClick, disabled, pendingSquares, winningLine }) {
  function getSquareClass(index) {
    const value = board[index]
    const classes = ['square']

    if (disabled) {
      classes.push('square-disabled')
    }

    if (value % 2 === 1) {
      classes.push('square-odd')
    } else if (value > 0) {
      classes.push('square-even')
    }

    if (pendingSquares.has(index)) {
      classes.push('square-pending')
    }

    if (winningLine.includes(index)) {
      classes.push('square-winning')
    }

    return classes.join(' ')
  }

  return (
    <div className="board">
      {board.map((value, index) => (
        <button
          key={index}
          data-square={index}
          className={getSquareClass(index)}
          onClick={() => onSquareClick(index)}
          disabled={disabled}
        >
          {value}
        </button>
      ))}
    </div>
  )
}

export default GameBoard
