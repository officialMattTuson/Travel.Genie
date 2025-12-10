// Itinerary DTOs & Enums
export enum ItineraryItemType {
  Activity = 'Activity',
  Transport = 'Transport',
  Accommodation = 'Accommodation',
  Food = 'Food',
  FreeTime = 'FreeTime',
  Note = 'Note'
}

export enum TransportMode {
  Flight = 'Flight',
  Train = 'Train',
  Bus = 'Bus',
  Car = 'Car',
  Ferry = 'Ferry',
  Walk = 'Walk',
  Bike = 'Bike',
  Other = 'Other'
}

export interface CostDto {
  amount: number;
  currencyCode: string;
  isEstimated: boolean;
}

export interface PlaceDto {
  name: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  googlePlaceId?: string | null;
}

export interface TransportInfoDto {
  mode: TransportMode;
  from: PlaceDto;
  to: PlaceDto;
  bookingReference?: string | null;
  carrierName?: string | null;
  transportNumber?: string | null;
}

export interface AccommodationInfoDto {
  providerName: string;
  providerType?: string | null;
  location: PlaceDto;
  checkInDate: string; // ISO date string
  checkOutDate: string;
  bookingReference?: string | null;
  bookingPlatform?: string | null;
}

export interface ItineraryItemDto {
  id: string;
  type: ItineraryItemType;
  title: string;
  description?: string | null;
  startTime?: string | null; // ISO datetime string
  endTime?: string | null;
  place?: PlaceDto | null;
  cost?: CostDto | null;
  transport?: TransportInfoDto | null;
  accommodation?: AccommodationInfoDto | null;
  isAiSuggested: boolean;
  isUserEdited: boolean;
}

export interface ItineraryDayDto {
  id: string;
  date: string; // ISO date string
  dayNumber: number;
  summary?: string | null;
  items: ItineraryItemDto[];
}

export interface TripBudgetDto {
  currencyCode: string;
  totalBudget: number;
  dailyTarget?: number | null;
}
