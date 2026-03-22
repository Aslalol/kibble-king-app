import { useState, useCallback } from 'react';
import { mockPets, mockFeederStatus, mockFeedingHistory, mockAlerts, mockDailyConsumption, api } from '@/lib/mock-data';
import { PetCard } from '@/components/PetCard';
import { FeederStatusCard } from '@/components/FeederStatusCard';
import { AlertsPanel } from '@/components/AlertsPanel';
import { ConsumptionChart } from '@/components/ConsumptionChart';
import { FeedingHistory } from '@/components/FeedingHistory';
import { FeederControl } from '@/components/FeederControl';
import { PetForm } from '@/components/PetForm';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Tab = 'dashboard' | 'control';

const Index = () => {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [showPetForm, setShowPetForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const forceRefresh = useCallback(() => setRefreshKey(n => n + 1), []);

  const handleDeletePet = async (id: string) => {
    const pet = mockPets.find(p => p.id === id);
    if (!pet) return;
    await api.deletePet(id);
    toast.success(`${pet.name} removido(a)`);
    forceRefresh();
  };

  return (
    <div className="min-h-screen pb-24" key={refreshKey}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-md">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">S</span>
            </div>
            <h1 className="text-lg font-bold text-foreground leading-tight">SmartBite</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setShowPetForm(true)}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-[57px] z-30 bg-background border-b">
        <div className="mx-auto max-w-2xl px-4 flex gap-1 py-1.5">
          {([
            ['dashboard', 'Dashboard'],
            ['control', 'Controle'],
          ] as [Tab, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all active:scale-[0.97] ${
                tab === key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-2xl px-4 py-5 space-y-5">
        {tab === 'dashboard' ? (
          <>
            <ScrollReveal>
              <AlertsPanel alerts={mockAlerts} />
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <FeederStatusCard status={mockFeederStatus} />
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Meus Pets</h3>
                <div className="grid gap-2">
                  {mockPets.map(pet => (
                    <PetCard key={pet.id} pet={pet} onDelete={handleDeletePet} />
                  ))}
                  {mockPets.length === 0 && (
                    <p className="text-sm text-muted-foreground py-6 text-center">
                      Nenhum pet cadastrado. Adicione um para começar!
                    </p>
                  )}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <ConsumptionChart data={mockDailyConsumption} />
            </ScrollReveal>

            <ScrollReveal delay={0.25}>
              <FeedingHistory records={mockFeedingHistory} />
            </ScrollReveal>
          </>
        ) : (
          <ScrollReveal>
            <FeederControl pets={mockPets} />
          </ScrollReveal>
        )}
      </main>

      {showPetForm && <PetForm onClose={() => setShowPetForm(false)} onAdded={forceRefresh} />}
    </div>
  );
};

export default Index;
