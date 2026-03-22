import { useState } from 'react';
import { Alert, AlertSeverity } from '@/lib/types';
import { api } from '@/lib/mock-data';
import { AlertTriangle, Utensils, WifiOff, Info, X, Check, Cog } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AlertsPanelProps {
  alerts: Alert[];
}

const alertIcons: Record<string, React.ElementType> = {
  pet_not_eating: Utensils,
  food_low: AlertTriangle,
  device_offline: WifiOff,
  motor_stuck: Cog,
  feeding_below: Info,
};

const severityStyles: Record<AlertSeverity, { border: string; bg: string; icon: string }> = {
  critical: {
    border: 'border-l-[hsl(var(--destructive))]',
    bg: 'bg-[hsl(var(--destructive))]/8',
    icon: 'text-[hsl(var(--destructive))] bg-[hsl(var(--destructive))]/12',
  },
  warning: {
    border: 'border-l-[hsl(var(--warning))]',
    bg: 'bg-[hsl(var(--warning))]/8',
    icon: 'text-[hsl(var(--warning))] bg-[hsl(var(--warning))]/12',
  },
  info: {
    border: 'border-l-[hsl(var(--info))]',
    bg: 'bg-[hsl(var(--info))]/6',
    icon: 'text-[hsl(var(--info))] bg-[hsl(var(--info))]/12',
  },
};

const severityLabels: Record<AlertSeverity, string> = {
  critical: 'Crítico',
  warning: 'Aviso',
  info: 'Informativo',
};

export function AlertsPanel({ alerts: initialAlerts }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const visibleAlerts = alerts.filter(a => !a.dismissed);

  if (visibleAlerts.length === 0) return null;

  const handleDismiss = async (id: string) => {
    await api.dismissAlert(id);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a));
  };

  const handleMarkRead = async (id: string) => {
    await api.markAlertRead(id);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-foreground">Alertas</h3>
      {visibleAlerts.map((alert) => {
        const Icon = alertIcons[alert.type] ?? Info;
        const style = severityStyles[alert.severity];
        return (
          <div
            key={alert.id}
            className={`flex items-start gap-3 rounded-xl border-l-4 ${style.border} ${style.bg} bg-card p-4 shadow-sm transition-opacity ${alert.read ? 'opacity-60' : ''}`}
          >
            <div className={`rounded-lg p-2 ${style.icon}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${alert.severity === 'critical' ? 'text-[hsl(var(--destructive))]' : alert.severity === 'warning' ? 'text-[hsl(var(--warning))]' : 'text-[hsl(var(--info))]'}`}>
                  {severityLabels[alert.severity]}
                </span>
              </div>
              <p className="text-sm text-foreground">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatDistanceToNow(alert.timestamp, { addSuffix: true, locale: ptBR })}
              </p>
            </div>
            <div className="flex gap-1">
              {!alert.read && (
                <button onClick={() => handleMarkRead(alert.id)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary transition-colors active:scale-95" title="Marcar como lido">
                  <Check className="h-3.5 w-3.5" />
                </button>
              )}
              <button onClick={() => handleDismiss(alert.id)} className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors active:scale-95" title="Dispensar">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
