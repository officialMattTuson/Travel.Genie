export enum TravelStyle {
  Relaxed = 'Relaxed',
  Balanced = 'Balanced',
  Adventure = 'Adventure'
}

export enum BudgetLevel {
  Backpacker = 'Backpacker',
  Budget = 'Budget',
  MidRange = 'MidRange',
  Luxury = 'Luxury'
}

export enum PacePreference {
  Slow = 'Slow',
  Moderate = 'Moderate',
  Fast = 'Fast'
}

export enum ActivityInterest {
  Nature = 'Nature',
  Beach = 'Beach',
  Hiking = 'Hiking',
  Food = 'Food',
  Cafes = 'Cafes',
  Nightlife = 'Nightlife',
  Museums = 'Museums',
  History = 'History',
  Shopping = 'Shopping',
  ThemeParks = 'ThemeParks',
  Wellness = 'Wellness'
}

export interface UserTravelPreferencesDto {
  travelStyle: TravelStyle;
  budgetLevel: BudgetLevel;
  pace: PacePreference;
  interests: ActivityInterest[];
  prefersWalkableAreas: boolean;
  prefersPublicTransport: boolean;
  prefersNightlife: boolean;
}

export interface UserProfileDto {
  id: string;
  email: string;
  displayName: string;
  homeCity?: string | null;
  homeCountryCode?: string | null;
  preferences: UserTravelPreferencesDto;
}
