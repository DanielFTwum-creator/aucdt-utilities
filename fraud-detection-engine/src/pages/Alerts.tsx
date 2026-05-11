import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useThemeStore } from '../themeStore';
import { AlertTriangle, Bell, CheckCircle, XCircle, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { Tooltip } from '../components/Tooltip';

interface Alert {
  id: number;
  entity_id: string;
  entity_name: string;
  severity: 'critical' | 'warning';
  message: string;
  health_score: number;
  acknowledged: number;
  created_at: string;
}

const severityConfig = {
  critical: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Critical' },
  warning: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Warning' },
  info: { icon: Bell, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Info' },
};

export function Alerts() {
  const { isDark, isHighContrast } = useThemeStore();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [ackedAlerts, setAckedAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('/api/v1/alerts');
      setAlerts(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAcknowledge = async (alert: Alert) => {
    try {
      await axios.patch(`/api/v1/alerts/${alert.id}/acknowledge`, {
        acknowledged_by: 'admin'
      });
      setAckedAlerts(prev => [...prev, alert]);
      setAlerts(prev => prev.filter(a => a.id !== alert.id));
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  const activeAlerts = alerts;

  return (
    <div className="space-y-8" role="region" aria-label="Alerts and Notifications">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={clsx("text-2xl font-bold", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>Alerts</h2>
          <p className={clsx("text-sm mt-1", isHighContrast ? "text-yellow-300" : isDark ? "text-slate-400" : "text-slate-500")}>
            System alerts and notifications
          </p>
        </div>
        <Tooltip text={activeAlerts.length > 0 ? "Active alerts requiring attention" : "All systems healthy"} position="left">
          <div className="flex items-center gap-2">
            <Bell className={isHighContrast && activeAlerts.length > 0 ? "text-yellow-500" : activeAlerts.length > 0 ? "text-red-500" : isHighContrast ? "text-yellow-400" : "text-emerald-500"} size={20} aria-hidden="true" />
            <span className={clsx("text-sm font-medium", isHighContrast ? "text-yellow-400" : isDark ? "text-slate-300" : "text-slate-700")}>
              {activeAlerts.length} active
            </span>
          </div>
        </Tooltip>
      </div>

      {activeAlerts.length === 0 && (
        <Tooltip text="All monitored entities are operating within normal parameters" position="top">
          <div className={clsx("p-8 rounded-xl border text-center", isHighContrast ? "bg-black border-yellow-400" : isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-100 shadow-sm")}>
            <CheckCircle className={clsx("mx-auto mb-3", isHighContrast ? "text-yellow-400" : "text-emerald-500")} size={40} aria-hidden="true" />
            <p className={clsx("font-bold", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>All Clear</p>
            <p className={clsx("text-sm mt-1", isHighContrast ? "text-yellow-300" : isDark ? "text-slate-400" : "text-slate-500")}>
              No active alerts. All entities are healthy.
            </p>
          </div>
        </Tooltip>
      )}

      {activeAlerts.length > 0 && (
        <div className="space-y-3" role="list" aria-label="Active alerts">
          {activeAlerts.map(alert => {
            const config = severityConfig[alert.severity];
            const Icon = config.icon;
            return (
              <div
                key={alert.id}
                className={clsx(
                  "p-4 rounded-xl border flex items-center justify-between",
                  isHighContrast ? "bg-black border-yellow-400" : isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-100 shadow-sm"
                )}
                role="listitem"
              >
                <div className="flex items-center gap-4">
                  <div className={clsx("p-2 rounded-lg", isHighContrast ? "bg-yellow-400/20" : config.bg)}>
                    <Icon className={isHighContrast ? "text-yellow-400" : config.color} size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <p className={clsx("font-medium text-sm", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>
                      {alert.entity_name}
                    </p>
                    <p className={clsx("text-sm", isHighContrast ? "text-yellow-300" : isDark ? "text-slate-400" : "text-slate-500")}>
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock size={12} className={isHighContrast ? "text-yellow-600" : isDark ? "text-slate-500" : "text-slate-400"} aria-hidden="true" />
                      <span className={clsx("text-xs", isHighContrast ? "text-yellow-500" : isDark ? "text-slate-500" : "text-slate-400")}>
                        {new Date(alert.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Tooltip text={`Severity: ${config.label}`} position="top">
                    <span className={clsx("text-xs font-medium px-2 py-1 rounded-full", isHighContrast ? "bg-yellow-400/20 text-yellow-400" : `${config.bg} ${config.color}`)}>
                      {config.label}
                    </span>
                  </Tooltip>
                  <Tooltip text="Mark this alert as reviewed and acknowledged" position="top">
                    <button
                      onClick={() => handleAcknowledge(alert)}
                      aria-label={`Acknowledge alert for ${alert.entity_name}`}
                      className={clsx(
                        "text-xs font-medium px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2",
                        isHighContrast
                          ? "bg-yellow-400 text-black hover:bg-yellow-300 focus:ring-yellow-400"
                          : isDark
                          ? "bg-slate-700 text-slate-300 hover:bg-slate-600 focus:ring-slate-500"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 focus:ring-slate-400"
                      )}
                    >
                      Acknowledge
                    </button>
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {ackedAlerts.length > 0 && (
        <div role="region" aria-label="Acknowledged alerts">
          <h3 className={clsx("text-sm font-medium mb-3", isHighContrast ? "text-yellow-500" : isDark ? "text-slate-500" : "text-slate-400")}>
            Acknowledged ({ackedAlerts.length})
          </h3>
          <div className="space-y-2">
            {ackedAlerts.map(alert => (
              <div
                key={alert.id}
                className={clsx(
                  "p-3 rounded-lg border opacity-60 flex items-center gap-3",
                  isHighContrast ? "bg-black border-yellow-400/50" : isDark ? "bg-slate-800/30 border-slate-700" : "bg-slate-50 border-slate-100"
                )}
              >
                <CheckCircle size={16} className={isHighContrast ? "text-yellow-500" : "text-emerald-500"} aria-hidden="true" />
                <span className={clsx("text-sm", isHighContrast ? "text-yellow-400" : isDark ? "text-slate-400" : "text-slate-500")}>
                  {alert.entity_name}: {alert.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
