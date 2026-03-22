import { Alert } from '@/lib/types';
import { AlertTriangle, Utensils, WifiOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AlertsPanelProps {
  alerts: Alert[];
}

const alertIcons = {
  pet_not_eating: Utensils,
  food_low: AlertTriangle,
  device_offline: WifiOff,
};

const alertColors = {
  pet_not_eating: 'text-[hsl(var(--warning))] bg-[hsl(var(--warning))]/10',
  food_low: 'text-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10',
  device_offline: 'text-[hsl(var(--destructive))] bg-[hsl(var(--destructive))]/10',
};

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-foreground">Alertas</h3>
      {alerts.map((alert) => {
        const Icon = alertIcons[alert.type];
        return (
          <div
            key={alert.id}
            className="flex items-start gap-3 rounded-xl bg-card p-4 shadow-sm"
          >
            <div className={`rounded-lg p-2 ${alertColors[alert.type]}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatDistanceToNow(alert.timestamp, { addSuffix: true, locale: ptBR })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
