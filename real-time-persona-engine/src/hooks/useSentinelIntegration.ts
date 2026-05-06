import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface SentinelHealth {
  appId: number
  status: 'healthy' | 'degraded' | 'critical'
  score: number
  timestamp: string
}

export function useSentinelIntegration() {
  const [isConnected, setIsConnected] = useState(false)

  // Fetch health from Sentinel
  const { data: health, isLoading } = useQuery({
    queryKey: ['sentinel-health', 247],
    queryFn: async () => {
      const response = await axios.get<SentinelHealth>('/api/v1/sentinel/health')
      return response.data
    },
    refetchInterval: 30000, // 30 seconds
  })

  useEffect(() => {
    // WebSocket connection to Sentinel
    const ws = new WebSocket(
      `ws${location.protocol === 'https:' ? 's' : ''}://${location.host}/api/v1/sentinel/ws`
    )

    ws.onopen = () => {
      setIsConnected(true)
      ws.send(JSON.stringify({ type: 'register', appId: 247 }))
    }

    ws.onclose = () => {
      setIsConnected(false)
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      console.log('Sentinel message:', message)
      // Handle Sentinel commands
    }

    return () => {
      ws.close()
    }
  }, [])

  return { health, isConnected, isLoading }
}
