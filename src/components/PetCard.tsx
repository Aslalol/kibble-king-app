import { Pet } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PetCardProps {
  pet: Pet;
  selected?: boolean;
  onClick?: () => void;
}

const goalLabels: Record<string, string> = {
  weight_loss: 'Perda de peso',
  maintenance: 'Manutenção',
  weight_gain: 'Ganho de peso',
};

const activityLabels: Record<string, string> = {
  low: 'Baixa',
  moderate: 'Moderada',
  high: 'Alta',
};

export function PetCard({ pet, selected, onClick }: PetCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-xl p-4 transition-all duration-200 border-2',
        'hover:shadow-md active:scale-[0.98]',
        selected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-transparent bg-card shadow-sm hover:border-primary/20'
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl leading-none mt-0.5">{pet.avatarEmoji}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base text-foreground">{pet.name}</h3>
          <p className="text-sm text-muted-foreground">
            {pet.breed} · {pet.age} {pet.age === 1 ? 'ano' : 'anos'}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {pet.weight}kg
            </span>
            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {activityLabels[pet.activityLevel]}
            </span>
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {goalLabels[pet.feedingGoal]}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
