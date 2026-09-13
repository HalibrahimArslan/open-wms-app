import React, { createContext, useEffect, useState, useRef } from 'react'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('WebSocket bağlantısı kuruldu')
        setIsConnected(true)
      }

      ws.onmessage = (event) => {
        console.log('Gelen mesaj:', event.data)
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            message: event.data,
            timestamp: new Date(),
          },
        ])
      }

      ws.onerror = (error) => {
        console.error('WebSocket hatası:', error)
        setIsConnected(false)
      }

      ws.onclose = () => {
        console.log('WebSocket bağlantısı kapatıldı')
        setIsConnected(false)

        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Yeniden bağlanmaya çalışılıyor...')
          connectWebSocket()
        }, 3000)
      }
    } catch (error) {
      console.error('WebSocket bağlantı hatası:', error)
      setIsConnected(false)
    }
  }

  useEffect(() => {
    connectWebSocket()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  const clearMessages = () => {
    setMessages([])
  }

  const removeMessage = (messageId) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
  }

  const reconnect = () => {
    if (wsRef.current) {
      wsRef.current.close()
    }
    connectWebSocket()
  }

  const value = {
    messages,
    isConnected,
    clearMessages,
    removeMessage,
    reconnect,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export { NotificationContext }
