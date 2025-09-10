import { Injectable } from '@angular/core';
import { mockBookings } from '../mocks/mock-bookings';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor() {}

  getBookings() {
    return of(mockBookings);
  }
}
