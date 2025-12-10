import { ItineraryDayDto } from "./itinerary.dtos";

export enum TripStatus {
    Draft = 'Draft',
    Planned = 'Planned',
    InProgress = 'InProgress',
    Completed = 'Completed',
    Cancelled = 'Cancelled'
}

export interface DestinationDto {
    id: string;
    name: string;
    countryCode: string;
    latitude?: number | null;
    longitude?: number | null;
    timeZoneId?: string | null;
}

export interface TravelCompanionDto {
    id: string;
    name: string;
    age?: number | null;
    isChild: boolean;
    sharesCosts: boolean;
}

export interface TripBudgetDto {
    currencyCode: string;
    totalBudget: number;
    dailyTarget?: number | null;
}

export interface TripSummaryDto {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    primaryDestinationName: string;
    coverImageUrl?: string | null;
    status: TripStatus;
    dayCount: number;
    plannedItemsCount: number;
}

export interface TripDetailDto {
    id: string;
    name: string;
    description?: string | null;
    startDate: string;
    endDate: string;
    status: TripStatus;
    primaryDestination: DestinationDto;
    destinations: DestinationDto[];
    budget?: TripBudgetDto | null;
    companions: TravelCompanionDto[];
    itineraryDays: ItineraryDayDto[];
    hasAiGeneratedPlan: boolean;
    lastAiPlanUpdatedAt?: string | null;
}
