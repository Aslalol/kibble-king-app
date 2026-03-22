import { useState } from 'react';
import { Species, ActivityLevel, FeedingGoal } from '@/lib/types';
import { api } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { X } from 'lucide-react';

interface PetFormProps {
  onClose: () => void;
  onAdded: () => void;
}

export function PetForm({ onClose, onAdded }: PetFormProps) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<Species>('dog');
  const [breed, setBreed] = useState('');
  const [weight, setWeight] = useState(10);
  const [age, setAge] = useState(2);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [feedingGoal, setFeedingGoal] = useState<FeedingGoal>('maintenance');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !breed.trim()) {
      toast.error('Preencha todos os campos.');
      return;
    }
    await api.addPet({ name, species, breed, weight, age, activityLevel, feedingGoal });
    toast.success(`${name} cadastrado(a) com sucesso!`);
    onAdded();
    onClose();
  };

  const inputClass =
    'w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';
  const labelClass = 'text-sm font-medium text-foreground mb-1 block';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-foreground">Cadastrar Pet</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-secondary transition-colors active:scale-95">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Nome</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Ex: Thor" />
          </div>

          <div>
            <label className={labelClass}>Espécie</label>
            <div className="flex gap-2">
              {(['dog', 'cat'] as Species[]).map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSpecies(s)}
                  className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-medium transition-all active:scale-[0.97] ${
                    species === s
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {s === 'dog' ? '🐕 Cachorro' : '🐱 Gato'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Raça</label>
            <input value={breed} onChange={(e) => setBreed(e.target.value)} className={inputClass} placeholder="Ex: Golden Retriever" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Peso (kg)</label>
              <input type="number" min={0.5} step={0.5} value={weight} onChange={(e) => setWeight(Number(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Idade (anos)</label>
              <input type="number" min={0} value={age} onChange={(e) => setAge(Number(e.target.value))} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Nível de Atividade</label>
            <div className="flex gap-2">
              {([
                ['low', 'Baixa'],
                ['moderate', 'Moderada'],
                ['high', 'Alta'],
              ] as [ActivityLevel, string][]).map(([val, label]) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setActivityLevel(val)}
                  className={`flex-1 rounded-lg px-2 py-2 text-xs font-medium transition-all active:scale-[0.97] ${
                    activityLevel === val
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Objetivo Alimentar</label>
            <div className="flex gap-2">
              {([
                ['weight_loss', 'Perder peso'],
                ['maintenance', 'Manter'],
                ['weight_gain', 'Ganhar peso'],
              ] as [FeedingGoal, string][]).map(([val, label]) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setFeedingGoal(val)}
                  className={`flex-1 rounded-lg px-2 py-2 text-xs font-medium transition-all active:scale-[0.97] ${
                    feedingGoal === val
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full mt-2">
            Cadastrar Pet
          </Button>
        </form>
      </div>
    </div>
  );
}
