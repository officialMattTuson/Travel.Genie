import { ActivityInterest, BudgetLevel, PacePreference } from './user.dtos';
import { DestinationDto, TripBudgetDto } from './trip.dtos';
import { ItineraryDayDto } from './itinerary.dtos';

export enum AiInsightType {
  GeneralTip = 'GeneralTip',
  BudgetTip = 'BudgetTip',
  TransportTip = 'TransportTip',
  SafetyTip = 'SafetyTip',
  WeatherTip = 'WeatherTip',
  LocalCustom = 'LocalCustom'
}

export enum AiChatSender {
  User = 'User',
  Assistant = 'Assistant',
  System = 'System'
}

export interface AiInsightDto {
  title: string;
  body: string;
  type: AiInsightType;
}

export interface AiPlanRequestDto {
  tripId?: string | null;
  tripName?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  primaryDestination: DestinationDto;
  additionalDestinations: DestinationDto[];
  travellersCount?: number | null;
  childrenCount?: number | null;
  budgetLevel?: BudgetLevel | null;
  pace?: PacePreference | null;
  interests: ActivityInterest[];
  specialNotes?: string | null;
}

export interface AiPlanResponseDto {
  proposalId: string;
  suggestedTripName: string;
  suggestedBudget?: TripBudgetDto | null;
  suggestedDays: ItineraryDayDto[];
  insights: AiInsightDto[];
}

export interface AiChatMessageDto {
  id: string;
  tripId: string;
  createdAt: string;
  sender: AiChatSender;
  message: string;
}
