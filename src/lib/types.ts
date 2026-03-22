export type Species = 'dog' | 'cat';
export type ActivityLevel = 'low' | 'moderate' | 'high';
export type FeedingGoal = 'weight_loss' | 'maintenance' | 'weight_gain';
export type DeviceState = 'online' | 'processing' | 'offline';
export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  weight: number;
  age: number;
  activityLevel: ActivityLevel;
  feedingGoal: FeedingGoal;
  avatarEmoji: string;
  dailyRecommendedGrams: number;
}

export interface FeederStatus {
  online: boolean;
  deviceState: DeviceState;
  foodLevelPercent: number;
  lastFeedingAt: Date | null;
  lastFeedingAmount: number;
  wifiSignal: number;
  lastSyncAt: Date;
  motorStatus: 'ok' | 'stuck' | 'unknown';
  estimatedDaysRemaining: number;
  firmwareVersion: string;
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
  time: string;
  amountGrams: number;
  enabled: boolean;
  days: number[];
}

export interface Alert {
  id: string;
  type: 'pet_not_eating' | 'food_low' | 'device_offline' | 'motor_stuck' | 'feeding_below';
  severity: AlertSeverity;
  message: string;
  timestamp: Date;
  read: boolean;
  dismissed: boolean;
}

export interface DailyConsumption {
  date: string;
  recommended: number;
  served: number;
}
