function StatusBar({ playerType, connectionStatus, isConnected }) {
  function getStatusDotClass() {
    if (connectionStatus === 'connected') return 'status-dot status-connected'
    if (connectionStatus === 'waiting') return 'status-dot status-waiting'
    return 'status-dot status-disconnected'
  }

  function getStatusText() {
    if (connectionStatus === 'connected') return 'Connected'
    if (connectionStatus === 'waiting') return 'Waiting for opponent...'
    return 'Disconnected'
  }

  return (
    <div className="status-bar">
      <div className="player-info">
        {playerType ? (
          <>
            You are:{' '}
            <span className={playerType === 'ODD' ? 'player-odd' : 'player-even'}>
              {playerType === 'ODD' ? '🔵 Odd Player' : '🟢 Even Player'}
            </span>
          </>
        ) : (
          'Connecting...'
        )}
      </div>

      <div className="connection-status">
        <div className={getStatusDotClass()}></div>
        {getStatusText()}
      </div>
    </div>
  )
}

export default StatusBar
