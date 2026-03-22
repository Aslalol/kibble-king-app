export type Species = 'dog' | 'cat';
export type ActivityLevel = 'low' | 'moderate' | 'high';
export type FeedingGoal = 'weight_loss' | 'maintenance' | 'weight_gain';

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  weight: number; // kg
  age: number; // years
  activityLevel: ActivityLevel;
  feedingGoal: FeedingGoal;
  avatarEmoji: string;
}

export interface FeederStatus {
  online: boolean;
  foodLevelPercent: number; // 0-100
  lastFeedingAt: Date | null;
  lastFeedingAmount: number; // grams
  wifiSignal: number; // 0-100
}

export interface FeedingRecord {
  id: string;
  petId: string;
  timestamp: Date;
  amountGrams: number;
  type: 'manual' | 'scheduled';
}

export interface FeedingSchedule {
  id: string;
  petId: string;
  time: string; // HH:mm
  amountGrams: number;
  enabled: boolean;
  days: number[]; // 0-6, Sun-Sat
}

export interface Alert {
  id: string;
  type: 'pet_not_eating' | 'food_low' | 'device_offline';
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface DailyConsumption {
  date: string;
  recommended: number;
  served: number;
}
