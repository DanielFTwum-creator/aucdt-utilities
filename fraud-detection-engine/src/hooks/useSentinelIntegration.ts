import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface SentinelHealth {
  appId: number;
  status: 'healthy' | 'degraded' | 'critical';
  score: number;
  timestamp: string;
}

export function useSentinelIntegration() {
  const [health, setHealth] = useState<SentinelHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const fetchHealth = useCallback(async () => {
    try {
      const response = await axios.get<SentinelHealth>('/api/v1/sentinel/health-report');
      const data = response.data as any;
      setHealth({
        appId: data.app_id || 137,
        status: data.ecosystem_health?.overall_score >= 80 ? 'healthy'
          : data.ecosystem_health?.overall_score >= 50 ? 'degraded'
          : 'critical',
        score: data.ecosystem_health?.overall_score || 0,
        timestamp: data.timestamp || new Date().toISOString(),
      });
      setIsConnected(true);
    } catch {
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  return { health, isConnected, isLoading, refetch: fetchHealth };
}
