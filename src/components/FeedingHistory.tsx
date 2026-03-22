import { FeedingRecord } from '@/lib/types';
import { mockPets } from '@/lib/mock-data';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FeedingHistoryProps {
  records: FeedingRecord[];
}

export function FeedingHistory({ records }: FeedingHistoryProps) {
  const sorted = [...records].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="rounded-xl bg-card p-5 shadow-sm">
      <h3 className="font-semibold text-foreground mb-3">Histórico de Alimentação</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {sorted.map((r) => {
          const pet = mockPets.find((p) => p.id === r.petId);
          return (
            <div key={r.id} className="flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-2.5">
              <span className="text-lg">{pet?.avatarEmoji ?? '🐾'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{pet?.name ?? 'Pet'}</p>
                <p className="text-xs text-muted-foreground">
                  {format(r.timestamp, "dd MMM '·' HH:mm", { locale: ptBR })} ·{' '}
                  {r.type === 'manual' ? 'Manual' : 'Agendado'}
                </p>
              </div>
              <span className="text-sm font-semibold text-foreground tabular-nums">{r.amountGrams}g</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
