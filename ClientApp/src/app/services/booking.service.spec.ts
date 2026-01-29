import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BookingService } from './booking.service';
import { Booking } from '../models/booking.model';

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(BookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get bookings with mock data', (done) => {
    service.getBookings().subscribe(result => {
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.pageNumber).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.totalCount).toBeGreaterThan(0);
      done();
    });
  });

  it('should get trip bookings by tripId', (done) => {
    const tripId = 'test-trip-id';
    service.getTripBookings(tripId).subscribe(result => {
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      done();
    });
  });

  it('should create a booking with mock data', (done) => {
    const newBooking: Partial<Booking> = {
      tripId: 'trip-123',
      userId: 'user-456'
    };

    service.createBooking(newBooking).subscribe(result => {
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.tripId).toBe(newBooking.tripId as string);
      expect(result.userId).toBe(newBooking.userId as string);
      done();
    });
  });

  it('should update a booking with mock data', (done) => {
    const bookingId = 'booking-123';
    const updatedBooking: Partial<Booking> = {
      tripId: 'trip-456'
    };

    service.updateBooking(bookingId, updatedBooking).subscribe(result => {
      expect(result).toBeDefined();
      expect(result.id).toBe(bookingId);
      expect(result.tripId).toBe(updatedBooking.tripId as string);
      done();
    });
  });

  it('should delete a booking with mock data', (done) => {
    const bookingId = 'booking-123';

    service.deleteBooking(bookingId).subscribe(result => {
      expect(result).toBeUndefined();
      done();
    });
  });
});
