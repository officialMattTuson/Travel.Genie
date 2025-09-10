export enum BookingType {
  Flight,
  Accommodation,
  CarRental,
  Activity,
  Food
}

export interface Booking {
  id: string;
  tripId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  bookingType: BookingType;
}
