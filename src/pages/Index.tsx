import { useState, useCallback } from 'react';
import { mockPets, mockFeederStatus, mockFeedingHistory, mockAlerts, mockDailyConsumption } from '@/lib/mock-data';
import { PetCard } from '@/components/PetCard';
import { FeederStatusCard } from '@/components/FeederStatusCard';
import { AlertsPanel } from '@/components/AlertsPanel';
import { ConsumptionChart } from '@/components/ConsumptionChart';
import { FeedingHistory } from '@/components/FeedingHistory';
import { FeederControl } from '@/components/FeederControl';
import { PetForm } from '@/components/PetForm';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Plus, PawPrint } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Tab = 'dashboard' | 'control';

const Index = () => {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [showPetForm, setShowPetForm] = useState(false);
  const [, setRefresh] = useState(0);
  const forceRefresh = useCallback(() => setRefresh((n) => n + 1), []);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-md">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PawPrint className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-bold text-foreground leading-tight">PetFeeder</h1>
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
            {/* Alerts */}
            <ScrollReveal>
              <AlertsPanel alerts={mockAlerts} />
            </ScrollReveal>

            {/* Feeder status */}
            <ScrollReveal delay={0.08}>
              <FeederStatusCard status={mockFeederStatus} />
            </ScrollReveal>

            {/* Pets */}
            <ScrollReveal delay={0.15}>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Meus Pets</h3>
                <div className="grid gap-2">
                  {mockPets.map((pet) => (
                    <PetCard key={pet.id} pet={pet} />
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Chart */}
            <ScrollReveal delay={0.2}>
              <ConsumptionChart data={mockDailyConsumption} />
            </ScrollReveal>

            {/* History */}
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

      {/* Pet form modal */}
      {showPetForm && <PetForm onClose={() => setShowPetForm(false)} onAdded={forceRefresh} />}
    </div>
  );
};

export default Index;
