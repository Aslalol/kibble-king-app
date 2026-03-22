import { Pet, FeederStatus, FeedingRecord, FeedingSchedule, Alert, DailyConsumption } from './types';

export const mockPets: Pet[] = [
  {
    id: '1',
    name: 'Thor',
    species: 'dog',
    breed: 'Golden Retriever',
    weight: 32,
    age: 4,
    activityLevel: 'high',
    feedingGoal: 'maintenance',
    avatarEmoji: '🐕',
  },
  {
    id: '2',
    name: 'Luna',
    species: 'cat',
    breed: 'Siamês',
    weight: 4.5,
    age: 2,
    activityLevel: 'moderate',
    feedingGoal: 'maintenance',
    avatarEmoji: '🐱',
  },
];

export const mockFeederStatus: FeederStatus = {
  online: true,
  foodLevelPercent: 68,
  lastFeedingAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  lastFeedingAmount: 150,
  wifiSignal: 82,
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
  { id: 'a1', type: 'food_low', message: 'Nível de ração abaixo de 30%. Reabasteça em breve.', timestamp: new Date(now - 2 * 3600000), read: false },
  { id: 'a2', type: 'pet_not_eating', message: 'Luna não comeu nas últimas 12 horas.', timestamp: new Date(now - 6 * 3600000), read: false },
];

export const mockDailyConsumption: DailyConsumption[] = [
  { date: 'Seg', recommended: 380, served: 350 },
  { date: 'Ter', recommended: 380, served: 400 },
  { date: 'Qua', recommended: 380, served: 370 },
  { date: 'Qui', recommended: 380, served: 360 },
  { date: 'Sex', recommended: 380, served: 390 },
  { date: 'Sáb', recommended: 380, served: 340 },
  { date: 'Dom', recommended: 380, served: 375 },
];

// Simulated API functions
export const api = {
  getPets: () => Promise.resolve(mockPets),
  getFeederStatus: () => Promise.resolve(mockFeederStatus),
  getFeedingHistory: () => Promise.resolve(mockFeedingHistory),
  getSchedules: () => Promise.resolve(mockSchedules),
  getAlerts: () => Promise.resolve(mockAlerts),
  getDailyConsumption: () => Promise.resolve(mockDailyConsumption),
  triggerManualFeed: (petId: string, amount: number) => {
    console.log(`[ESP32 Mock] Liberando ${amount}g para pet ${petId}`);
    return Promise.resolve({ success: true });
  },
  addPet: (pet: Omit<Pet, 'id' | 'avatarEmoji'>) => {
    const newPet: Pet = {
      ...pet,
      id: String(Date.now()),
      avatarEmoji: pet.species === 'dog' ? '🐕' : '🐱',
    };
    mockPets.push(newPet);
    return Promise.resolve(newPet);
  },
  addSchedule: (schedule: Omit<FeedingSchedule, 'id'>) => {
    const newSchedule: FeedingSchedule = { ...schedule, id: String(Date.now()) };
    mockSchedules.push(newSchedule);
    return Promise.resolve(newSchedule);
  },
  toggleSchedule: (scheduleId: string) => {
    const s = mockSchedules.find(s => s.id === scheduleId);
    if (s) s.enabled = !s.enabled;
    return Promise.resolve({ success: true });
  },
};
