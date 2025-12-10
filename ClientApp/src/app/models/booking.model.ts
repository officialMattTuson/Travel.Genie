import { ItineraryItemType } from './dtos/itinerary.dtos';

// Legacy enum - kept for backward compatibility
export enum BookingType {
  Flight = 'Flight',
  Accommodation = 'Accommodation',
  CarRental = 'CarRental',
  Activity = 'Activity',
  Food = 'Food'
}

// Modern interfaces - use specific DTOs instead
export interface Booking {
  id: string;
  tripId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  bookingType: BookingType | ItineraryItemType;
}

export { ItineraryItemType };
