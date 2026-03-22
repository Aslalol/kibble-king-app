import { useState } from 'react';
import { Pet, FeedingSchedule } from '@/lib/types';
import { api, mockSchedules, getTodayConsumed } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Play, Plus, Clock, Pencil, Trash2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface FeederControlProps {
  pets: Pet[];
}

const dayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

type FeedState = 'idle' | 'loading' | 'success' | 'error';

export function FeederControl({ pets }: FeederControlProps) {
  const [selectedPet, setSelectedPet] = useState(pets[0]?.id ?? '');
  const [manualAmount, setManualAmount] = useState(100);
  const [schedules, setSchedules] = useState<FeedingSchedule[]>([...mockSchedules]);
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTime, setNewTime] = useState('12:00');
  const [newAmount, setNewAmount] = useState(100);
  const [newDays, setNewDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [feedState, setFeedState] = useState<FeedState>('idle');
  const [amountError, setAmountError] = useState('');

  const pet = pets.find(p => p.id === selectedPet);
  const petSchedules = schedules.filter(s => s.petId === selectedPet);
  const todayConsumed = getTodayConsumed(selectedPet);
  const dailyGoal = pet?.dailyRecommendedGrams ?? 0;
  const remaining = Math.max(0, dailyGoal - todayConsumed);
  const consumedPct = dailyGoal > 0 ? Math.min(100, Math.round((todayConsumed / dailyGoal) * 100)) : 0;

  const suggestedAmount = pet
    ? Math.round(pet.dailyRecommendedGrams / 2)
    : 100;

  const validateAmount = (val: number): string => {
    if (val < 10) return 'Mínimo 10g';
    if (val > 500) return 'Máximo 500g';
    if (pet && val > remaining + 20) return `Excede a meta diária restante (${remaining}g)`;
    return '';
  };

  const handleAmountChange = (val: number) => {
    setManualAmount(val);
    setAmountError(validateAmount(val));
  };

  const handleManualFeed = async () => {
    const err = validateAmount(manualAmount);
    if (err) { setAmountError(err); return; }

    setFeedState('loading');
    try {
      await api.triggerManualFeed(selectedPet, manualAmount);
      setFeedState('success');
      toast.success(`${manualAmount}g liberados para ${pet?.name}!`);
      setTimeout(() => setFeedState('idle'), 2500);
    } catch (e: any) {
      setFeedState('error');
      toast.error(e.message || 'Erro ao liberar ração');
      setTimeout(() => setFeedState('idle'), 3000);
    }
  };

  const handleToggle = async (id: string) => {
    await api.toggleSchedule(id);
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleAddSchedule = async () => {
    if (newDays.length === 0) { toast.error('Selecione ao menos um dia'); return; }
    const newSchedule = await api.addSchedule({
      petId: selectedPet, time: newTime, amountGrams: newAmount, enabled: true, days: newDays,
    });
    setSchedules(prev => [...prev, newSchedule]);
    setShowAddSchedule(false);
    setNewDays([0, 1, 2, 3, 4, 5, 6]);
    toast.success('Horário adicionado!');
  };

  const handleDeleteSchedule = async (id: string) => {
    await api.deleteSchedule(id);
    setSchedules(prev => prev.filter(s => s.id !== id));
    toast.success('Horário removido');
  };

  const startEdit = (s: FeedingSchedule) => {
    setEditingId(s.id);
    setNewTime(s.time);
    setNewAmount(s.amountGrams);
    setNewDays([...s.days]);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    await api.updateSchedule(editingId, { time: newTime, amountGrams: newAmount, days: newDays });
    setSchedules(prev => prev.map(s => s.id === editingId ? { ...s, time: newTime, amountGrams: newAmount, days: newDays } : s));
    setEditingId(null);
    toast.success('Horário atualizado!');
  };

  const toggleDay = (day: number) => {
    setNewDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const feedBtnContent = () => {
    switch (feedState) {
      case 'loading': return <><Loader2 className="h-4 w-4 animate-spin" />Enviando…</>;
      case 'success': return <><CheckCircle2 className="h-4 w-4" />Liberado!</>;
      case 'error': return <><AlertCircle className="h-4 w-4" />Falhou</>;
      default: return <><Play className="h-4 w-4" />Liberar</>;
    }
  };

  const feedBtnVariant = feedState === 'success' ? 'outline' : feedState === 'error' ? 'destructive' : 'default';

  return (
    <div className="space-y-6">
      {/* Pet selector */}
      <div className="flex gap-2 flex-wrap">
        {pets.map(p => (
          <button
            key={p.id}
            onClick={() => { setSelectedPet(p.id); setAmountError(''); }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all active:scale-[0.97] ${
              selectedPet === p.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            <span>{p.avatarEmoji}</span>{p.name}
          </button>
        ))}
      </div>

      {/* Pet context */}
      {pet && (
        <div className="rounded-xl bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-foreground">{pet.name} — Hoje</h4>
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              {todayConsumed}g / {dailyGoal}g
            </span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden mb-1.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${consumedPct >= 100 ? 'bg-[hsl(var(--warning))]' : 'bg-primary'}`}
              style={{ width: `${consumedPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{consumedPct}% consumido</span>
            <span>Faltam {remaining}g</span>
          </div>
        </div>
      )}

      {/* Manual feed */}
      <div className="rounded-xl bg-card p-5 shadow-sm space-y-4">
        <h3 className="font-semibold text-foreground">Alimentação Manual</h3>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="text-sm text-muted-foreground mb-1 block">Quantidade (g)</label>
            <input
              type="number"
              min={10}
              max={500}
              step={10}
              value={manualAmount}
              onChange={e => handleAmountChange(Number(e.target.value))}
              className={`w-full rounded-lg border px-3 py-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring bg-background ${amountError ? 'border-[hsl(var(--destructive))] focus:ring-[hsl(var(--destructive))]' : ''}`}
            />
            {amountError && <p className="text-xs text-[hsl(var(--destructive))] mt-1">{amountError}</p>}
            <button
              type="button"
              onClick={() => handleAmountChange(suggestedAmount)}
              className="text-xs text-primary hover:underline mt-1"
            >
              Sugestão: {suggestedAmount}g (metade da meta)
            </button>
          </div>
          <Button
            onClick={handleManualFeed}
            disabled={feedState === 'loading' || feedState === 'success'}
            variant={feedBtnVariant}
            className="gap-1.5 min-w-[120px]"
          >
            {feedBtnContent()}
          </Button>
        </div>
      </div>

      {/* Schedules */}
      <div className="rounded-xl bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Horários Automáticos</h3>
          <Button variant="ghost" size="sm" onClick={() => { setShowAddSchedule(!showAddSchedule); setEditingId(null); }} className="gap-1">
            <Plus className="h-4 w-4" />Novo
          </Button>
        </div>

        {(showAddSchedule || editingId) && (
          <div className="rounded-lg border bg-secondary/30 p-4 space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-1 block">Horário</label>
                <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-1 block">Qtd (g)</label>
                <input type="number" min={10} max={500} step={10} value={newAmount} onChange={e => setNewAmount(Number(e.target.value))} className="w-full rounded-lg border bg-background px-3 py-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Dias</label>
              <div className="flex gap-1">
                {dayNames.map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleDay(i)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                      newDays.includes(i) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={editingId ? handleSaveEdit : handleAddSchedule}>
                {editingId ? 'Salvar Alterações' : 'Adicionar'}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setShowAddSchedule(false); setEditingId(null); }}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {petSchedules.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">Nenhum horário configurado.</p>
          )}
          {petSchedules.map(s => (
            <div key={s.id} className="flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground tabular-nums">{s.time}</p>
                <div className="flex gap-0.5 mt-1">
                  {dayNames.map((d, i) => (
                    <span key={i} className={`w-5 h-5 rounded text-[10px] font-medium flex items-center justify-center ${
                      s.days.includes(i) ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground'
                    }`}>{d}</span>
                  ))}
                </div>
              </div>
              <span className="text-sm font-semibold text-foreground tabular-nums">{s.amountGrams}g</span>
              <button onClick={() => startEdit(s)} className="rounded-lg p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors active:scale-95">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => handleDeleteSchedule(s.id)} className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors active:scale-95">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <Switch checked={s.enabled} onCheckedChange={() => handleToggle(s.id)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
