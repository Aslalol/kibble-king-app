import { FeederStatus } from '@/lib/types';
import { Wifi, WifiOff, Battery, Clock, Cog, RefreshCw, Server } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FeederStatusCardProps {
  status: FeederStatus;
}

const stateLabels = {
  online: { label: 'Online', color: 'text-[hsl(var(--success))]' },
  processing: { label: 'Processando…', color: 'text-[hsl(var(--warning))]' },
  offline: { label: 'Offline', color: 'text-[hsl(var(--destructive))]' },
};

const motorLabels = {
  ok: { label: 'Funcionando', color: 'text-[hsl(var(--success))]' },
  stuck: { label: 'Travado', color: 'text-[hsl(var(--destructive))]' },
  unknown: { label: 'Desconhecido', color: 'text-muted-foreground' },
};

export function FeederStatusCard({ status }: FeederStatusCardProps) {
  const foodLevelColor =
    status.foodLevelPercent > 50
      ? 'bg-[hsl(var(--success))]'
      : status.foodLevelPercent > 20
      ? 'bg-[hsl(var(--warning))]'
      : 'bg-[hsl(var(--destructive))]';

  const state = stateLabels[status.deviceState];
  const motor = motorLabels[status.motorStatus];

  return (
    <div className="rounded-xl bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Status do Alimentador</h3>
        <div className="flex items-center gap-1.5">
          {status.deviceState === 'offline' ? (
            <WifiOff className="h-4 w-4 text-[hsl(var(--destructive))]" />
          ) : status.deviceState === 'processing' ? (
            <RefreshCw className="h-4 w-4 text-[hsl(var(--warning))] animate-spin" />
          ) : (
            <Wifi className="h-4 w-4 text-[hsl(var(--success))]" />
          )}
          <span className={`text-xs font-medium ${state.color}`}>{state.label}</span>
        </div>
      </div>

      {/* Food level */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Battery className="h-4 w-4" />
            Nível de ração
          </span>
          <span className="font-medium tabular-nums">{status.foodLevelPercent}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${foodLevelColor}`}
            style={{ width: `${status.foodLevelPercent}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground tabular-nums">
          ≈ {status.estimatedDaysRemaining} {status.estimatedDaysRemaining === 1 ? 'dia' : 'dias'} restantes
        </p>
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

      {/* Device details */}
      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Wifi className="h-3.5 w-3.5" />
          <span>WiFi: <span className="font-medium text-foreground tabular-nums">{status.wifiSignal}%</span></span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Cog className="h-3.5 w-3.5" />
          <span>Motor: <span className={`font-medium ${motor.color}`}>{motor.label}</span></span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Sync: {formatDistanceToNow(status.lastSyncAt, { addSuffix: true, locale: ptBR })}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Server className="h-3.5 w-3.5" />
          <span>FW: {status.firmwareVersion}</span>
        </div>
      </div>
    </div>
  );
}
