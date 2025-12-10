import { TravelStyle, BudgetLevel, PacePreference, ActivityInterest } from './dtos/user.dtos';
import { TripStatus } from './dtos/trip.dtos';

export enum TripType {
  Adventure = 'Adventure',
  Relaxation = 'Relaxation',
  Cultural = 'Cultural',
  Luxury = 'Luxury',
  Balanced = 'Balanced'
}

// Re-export modern enums
export { TravelStyle, BudgetLevel, PacePreference, ActivityInterest, TripStatus };
