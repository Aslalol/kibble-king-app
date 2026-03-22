import { useState } from 'react';
import { Pet, FeedingSchedule } from '@/lib/types';
import { api, mockSchedules } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Play, Plus, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface FeederControlProps {
  pets: Pet[];
}

const dayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export function FeederControl({ pets }: FeederControlProps) {
  const [selectedPet, setSelectedPet] = useState(pets[0]?.id ?? '');
  const [manualAmount, setManualAmount] = useState(100);
  const [schedules, setSchedules] = useState<FeedingSchedule[]>(mockSchedules);
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [newTime, setNewTime] = useState('12:00');
  const [newAmount, setNewAmount] = useState(100);

  const petSchedules = schedules.filter((s) => s.petId === selectedPet);

  const handleManualFeed = async () => {
    await api.triggerManualFeed(selectedPet, manualAmount);
    const pet = pets.find((p) => p.id === selectedPet);
    toast.success(`${manualAmount}g liberados para ${pet?.name}!`);
  };

  const handleToggle = async (id: string) => {
    await api.toggleSchedule(id);
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleAddSchedule = async () => {
    const newSchedule = await api.addSchedule({
      petId: selectedPet,
      time: newTime,
      amountGrams: newAmount,
      enabled: true,
      days: [0, 1, 2, 3, 4, 5, 6],
    });
    setSchedules((prev) => [...prev, newSchedule]);
    setShowAddSchedule(false);
    toast.success('Horário adicionado!');
  };

  return (
    <div className="space-y-6">
      {/* Pet selector */}
      <div className="flex gap-2">
        {pets.map((pet) => (
          <button
            key={pet.id}
            onClick={() => setSelectedPet(pet.id)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all active:scale-[0.97] ${
              selectedPet === pet.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            <span>{pet.avatarEmoji}</span>
            {pet.name}
          </button>
        ))}
      </div>

      {/* Manual feed */}
      <div className="rounded-xl bg-card p-5 shadow-sm space-y-4">
        <h3 className="font-semibold text-foreground">Alimentação Manual</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-sm text-muted-foreground mb-1 block">Quantidade (g)</label>
            <input
              type="number"
              min={10}
              max={500}
              step={10}
              value={manualAmount}
              onChange={(e) => setManualAmount(Number(e.target.value))}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button onClick={handleManualFeed} className="mt-5 gap-1.5">
            <Play className="h-4 w-4" />
            Liberar
          </Button>
        </div>
      </div>

      {/* Schedules */}
      <div className="rounded-xl bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Horários Automáticos</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddSchedule(!showAddSchedule)}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Novo
          </Button>
        </div>

        {showAddSchedule && (
          <div className="rounded-lg border bg-secondary/30 p-4 space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-1 block">Horário</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-1 block">Qtd (g)</label>
                <input
                  type="number"
                  min={10}
                  max={500}
                  step={10}
                  value={newAmount}
                  onChange={(e) => setNewAmount(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <Button size="sm" onClick={handleAddSchedule}>
              Salvar
            </Button>
          </div>
        )}

        <div className="space-y-2">
          {petSchedules.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Nenhum horário configurado.
            </p>
          )}
          {petSchedules.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-3"
            >
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground tabular-nums">{s.time}</p>
                <div className="flex gap-0.5 mt-1">
                  {dayNames.map((d, i) => (
                    <span
                      key={i}
                      className={`w-5 h-5 rounded text-[10px] font-medium flex items-center justify-center ${
                        s.days.includes(i)
                          ? 'bg-primary/15 text-primary'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-sm font-semibold text-foreground tabular-nums">{s.amountGrams}g</span>
              <Switch checked={s.enabled} onCheckedChange={() => handleToggle(s.id)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
