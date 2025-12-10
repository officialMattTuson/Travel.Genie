import { Booking, BookingType } from '../models/booking.model';
import { PagedResultDto } from '../models/dtos/common.dtos';

export const mockBookings: Booking[] = [
  {
    id: 'B001',
    tripId: '1',
    userId: '1',
    createdAt: '2025-09-10T12:00:00Z',
    updatedAt: '2025-09-10T12:00:00Z',
    bookingType: BookingType.Flight,
  },
  {
    id: 'B002',
    tripId: '2',
    userId: '2',
    createdAt: '2025-09-11T12:00:00Z',
    updatedAt: '2025-09-11T12:00:00Z',
    bookingType: BookingType.Accommodation,
  },
];

export const mockPagedBookingResults: PagedResultDto<Booking> = {
  items: mockBookings,
  totalCount: mockBookings.length,
  pageNumber: 1,
  pageSize: 10
};
