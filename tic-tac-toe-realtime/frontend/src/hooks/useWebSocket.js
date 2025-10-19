import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

function useWebSocket({ url, onMessage, onConnect, onDisconnect }) {
  const socket = useRef(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Create Socket.IO connection
    socket.current = io(url, {
      transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    // Connection event handlers
    socket.current.on('connect', () => {
      console.log('Socket.IO connected:', socket.current.id)
      setIsConnected(true)
      if (onConnect) onConnect()
    })

    socket.current.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason)
      setIsConnected(false)
      if (onDisconnect) onDisconnect()
    })

    socket.current.on('reconnect', (attemptNumber) => {
      console.log('Socket.IO reconnected after', attemptNumber, 'attempts')
      setIsConnected(true)
    })

    socket.current.on('reconnect_attempt', (attemptNumber) => {
      console.log('Socket.IO reconnection attempt:', attemptNumber)
    })

    socket.current.on('reconnect_error', (error) => {
      console.error('Socket.IO reconnection error:', error)
    })

    socket.current.on('reconnect_failed', () => {
      console.error('Socket.IO reconnection failed')
    })

    // Message handler
    socket.current.on('message', (message) => {
      if (onMessage) onMessage(message)
    })

    // Error handler
    socket.current.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error)
    })

    // Cleanup on unmount
    return () => {
      if (socket.current) {
        socket.current.disconnect()
        socket.current = null
      }
    }
  }, [url])

  function sendMessage(message) {
    if (socket.current && socket.current.connected) {
      socket.current.emit('message', message)
    } else {
      console.warn('Socket.IO is not connected')
    }
  }

  return {
    sendMessage,
    isConnected,
  }
}

export default useWebSocket
