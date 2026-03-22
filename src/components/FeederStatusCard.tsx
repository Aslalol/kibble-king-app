import { FeederStatus } from '@/lib/types';
import { Wifi, WifiOff, Battery, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FeederStatusCardProps {
  status: FeederStatus;
}

export function FeederStatusCard({ status }: FeederStatusCardProps) {
  const foodLevelColor =
    status.foodLevelPercent > 50
      ? 'bg-[hsl(var(--success))]'
      : status.foodLevelPercent > 20
      ? 'bg-[hsl(var(--warning))]'
      : 'bg-[hsl(var(--destructive))]';

  return (
    <div className="rounded-xl bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Status do Alimentador</h3>
        <div className="flex items-center gap-1.5">
          {status.online ? (
            <>
              <Wifi className="h-4 w-4 text-[hsl(var(--success))]" />
              <span className="text-xs font-medium text-[hsl(var(--success))]">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-[hsl(var(--destructive))]" />
              <span className="text-xs font-medium text-[hsl(var(--destructive))]">Offline</span>
            </>
          )}
        </div>
      </div>

      {/* Food level bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Battery className="h-4 w-4" />
            Nível de ração
          </span>
          <span className="font-medium">{status.foodLevelPercent}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${foodLevelColor}`}
            style={{ width: `${status.foodLevelPercent}%` }}
          />
        </div>
      </div>

      {/* Last feeding */}
      {status.lastFeedingAt && (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            Última refeição:{' '}
            <span className="text-foreground font-medium">
              {format(status.lastFeedingAt, "HH:mm '·' d MMM", { locale: ptBR })}
            </span>{' '}
            — {status.lastFeedingAmount}g
          </span>
        </div>
      )}

      {/* WiFi signal */}
      <div className="text-xs text-muted-foreground">
        Sinal WiFi: {status.wifiSignal}%
      </div>
    </div>
  );
}
