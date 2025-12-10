import { TripDetailDto, TripSummaryDto } from './dtos/trip.dtos';

export type TripDetails = TripDetailDto;
export type TripSummary = TripSummaryDto;

export interface Booking {
  id: string;
  tripId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  bookingType: string;
}

export interface TripDetailsWithBookings {
  trip: TripDetailDto;
  bookings: Booking[];
}
