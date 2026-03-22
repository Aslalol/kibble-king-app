import { Pet, FeederStatus, FeedingRecord, FeedingSchedule, Alert, DailyConsumption } from './types';

function calcRecommended(pet: Pet): number {
  const base = pet.species === 'dog' ? pet.weight * 15 : pet.weight * 20;
  const actMul = pet.activityLevel === 'high' ? 1.3 : pet.activityLevel === 'moderate' ? 1.1 : 0.9;
  const goalMul = pet.feedingGoal === 'weight_loss' ? 0.85 : pet.feedingGoal === 'weight_gain' ? 1.15 : 1;
  return Math.round(base * actMul * goalMul);
}

export const mockPets: Pet[] = [
  {
    id: '1', name: 'Thor', species: 'dog', breed: 'Golden Retriever',
    weight: 32, age: 4, activityLevel: 'high', feedingGoal: 'maintenance',
    avatarEmoji: '🐕', dailyRecommendedGrams: 0,
  },
  {
    id: '2', name: 'Luna', species: 'cat', breed: 'Siamês',
    weight: 4.5, age: 2, activityLevel: 'moderate', feedingGoal: 'maintenance',
    avatarEmoji: '🐱', dailyRecommendedGrams: 0,
  },
];
mockPets.forEach(p => { p.dailyRecommendedGrams = calcRecommended(p); });

export const mockFeederStatus: FeederStatus = {
  online: true,
  deviceState: 'online',
  foodLevelPercent: 68,
  lastFeedingAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  lastFeedingAmount: 150,
  wifiSignal: 82,
  lastSyncAt: new Date(Date.now() - 45000),
  motorStatus: 'ok',
  estimatedDaysRemaining: 4,
  firmwareVersion: 'v2.1.3',
};

const now = Date.now();
export const mockFeedingHistory: FeedingRecord[] = [
  { id: 'f1', petId: '1', timestamp: new Date(now - 3 * 3600000), amountGrams: 150, type: 'scheduled' },
  { id: 'f2', petId: '1', timestamp: new Date(now - 11 * 3600000), amountGrams: 200, type: 'scheduled' },
  { id: 'f3', petId: '2', timestamp: new Date(now - 5 * 3600000), amountGrams: 60, type: 'manual' },
  { id: 'f4', petId: '1', timestamp: new Date(now - 27 * 3600000), amountGrams: 180, type: 'scheduled' },
  { id: 'f5', petId: '2', timestamp: new Date(now - 29 * 3600000), amountGrams: 55, type: 'scheduled' },
  { id: 'f6', petId: '1', timestamp: new Date(now - 35 * 3600000), amountGrams: 200, type: 'scheduled' },
];

export const mockSchedules: FeedingSchedule[] = [
  { id: 's1', petId: '1', time: '07:30', amountGrams: 200, enabled: true, days: [0, 1, 2, 3, 4, 5, 6] },
  { id: 's2', petId: '1', time: '18:00', amountGrams: 180, enabled: true, days: [0, 1, 2, 3, 4, 5, 6] },
  { id: 's3', petId: '2', time: '08:00', amountGrams: 60, enabled: true, days: [0, 1, 2, 3, 4, 5, 6] },
  { id: 's4', petId: '2', time: '19:00', amountGrams: 55, enabled: false, days: [1, 2, 3, 4, 5] },
];

export const mockAlerts: Alert[] = [
  { id: 'a1', type: 'food_low', severity: 'warning', message: 'Nível de ração abaixo de 30%. Reabasteça em breve.', timestamp: new Date(now - 2 * 3600000), read: false, dismissed: false },
  { id: 'a2', type: 'pet_not_eating', severity: 'critical', message: 'Luna não comeu nas últimas 12 horas.', timestamp: new Date(now - 6 * 3600000), read: false, dismissed: false },
  { id: 'a3', type: 'feeding_below', severity: 'info', message: 'Thor comeu 8% abaixo do recomendado ontem.', timestamp: new Date(now - 18 * 3600000), read: false, dismissed: false },
];

export const mockDailyConsumption: DailyConsumption[] = [
  { date: 'Seg', recommended: 380, served: 350 },
  { date: 'Ter', recommended: 380, served: 400 },
  { date: 'Qua', recommended: 380, served: 370 },
  { date: 'Qui', recommended: 380, served: 310 },
  { date: 'Sex', recommended: 380, served: 390 },
  { date: 'Sáb', recommended: 380, served: 340 },
  { date: 'Dom', recommended: 380, served: 375 },
];

// Helper to get today's consumed amount for a pet
export function getTodayConsumed(petId: string): number {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return mockFeedingHistory
    .filter(r => r.petId === petId && r.timestamp >= todayStart)
    .reduce((sum, r) => sum + r.amountGrams, 0);
}

// Simulated API with realistic delays + possible failures
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

let _deviceState = mockFeederStatus.deviceState;

export const api = {
  getPets: () => delay(300).then(() => mockPets),
  getFeederStatus: () => delay(200).then(() => ({ ...mockFeederStatus, deviceState: _deviceState })),
  getFeedingHistory: () => delay(300).then(() => mockFeedingHistory),
  getSchedules: () => delay(200).then(() => mockSchedules),
  getAlerts: () => delay(200).then(() => mockAlerts),
  getDailyConsumption: () => delay(200).then(() => mockDailyConsumption),

  triggerManualFeed: async (petId: string, amount: number) => {
    _deviceState = 'processing';
    await delay(1500 + Math.random() * 1000);
    // 15% chance of failure
    if (Math.random() < 0.15) {
      _deviceState = 'online';
      throw new Error('ESP32: Motor não respondeu. Tente novamente.');
    }
    _deviceState = 'online';
    const record: FeedingRecord = {
      id: `f${Date.now()}`,
      petId,
      timestamp: new Date(),
      amountGrams: amount,
      type: 'manual',
    };
    mockFeedingHistory.unshift(record);
    mockFeederStatus.lastFeedingAt = new Date();
    mockFeederStatus.lastFeedingAmount = amount;
    mockFeederStatus.foodLevelPercent = Math.max(0, mockFeederStatus.foodLevelPercent - Math.round(amount / 50));
    return { success: true, record };
  },

  addPet: (pet: Omit<Pet, 'id' | 'avatarEmoji' | 'dailyRecommendedGrams'>) => {
    const newPet: Pet = {
      ...pet,
      id: String(Date.now()),
      avatarEmoji: pet.species === 'dog' ? '🐕' : '🐱',
      dailyRecommendedGrams: 0,
    };
    newPet.dailyRecommendedGrams = calcRecommended(newPet);
    mockPets.push(newPet);
    return delay(400).then(() => newPet);
  },

  deletePet: (petId: string) => {
    const idx = mockPets.findIndex(p => p.id === petId);
    if (idx !== -1) mockPets.splice(idx, 1);
    return delay(300).then(() => ({ success: true }));
  },

  addSchedule: (schedule: Omit<FeedingSchedule, 'id'>) => {
    const newSchedule: FeedingSchedule = { ...schedule, id: String(Date.now()) };
    mockSchedules.push(newSchedule);
    return delay(400).then(() => newSchedule);
  },

  updateSchedule: (id: string, updates: Partial<Omit<FeedingSchedule, 'id'>>) => {
    const s = mockSchedules.find(s => s.id === id);
    if (s) Object.assign(s, updates);
    return delay(300).then(() => s);
  },

  deleteSchedule: (id: string) => {
    const idx = mockSchedules.findIndex(s => s.id === id);
    if (idx !== -1) mockSchedules.splice(idx, 1);
    return delay(300).then(() => ({ success: true }));
  },

  toggleSchedule: (scheduleId: string) => {
    const s = mockSchedules.find(s => s.id === scheduleId);
    if (s) s.enabled = !s.enabled;
    return delay(200).then(() => ({ success: true }));
  },

  dismissAlert: (alertId: string) => {
    const a = mockAlerts.find(a => a.id === alertId);
    if (a) a.dismissed = true;
    return delay(200).then(() => ({ success: true }));
  },

  markAlertRead: (alertId: string) => {
    const a = mockAlerts.find(a => a.id === alertId);
    if (a) a.read = true;
    return delay(100).then(() => ({ success: true }));
  },
};
