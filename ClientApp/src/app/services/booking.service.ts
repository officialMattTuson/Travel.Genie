import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { Booking } from '../models/booking.model';
import { PagedResultDto } from '../models/dtos/common.dtos';
import { mockBookings } from '../mocks/mock-bookings';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly apiUrl = '/api/bookings';
  private useMockData = true;

  constructor(private readonly httpClient: HttpClient) {}

  getBookings(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResultDto<Booking>> {
    if (this.useMockData) {
      return this.getMockBookingsAsPaged();
    }

    return this.httpClient.get<PagedResultDto<Booking>>(
      `${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    ).pipe(
      catchError((error) => {
        console.warn('API request failed, falling back to mock bookings', error);
        return this.getMockBookingsAsPaged();
      })
    );
  }

  getTripBookings(tripId: string): Observable<Booking[]> {
    if (this.useMockData) {
      const bookings = mockBookings.filter(b => b.tripId === tripId);
      return of(bookings);
    }

    return this.httpClient.get<Booking[]>(`${this.apiUrl}/trip/${tripId}`).pipe(
      catchError(() => {
        const bookings = mockBookings.filter(b => b.tripId === tripId);
        return of(bookings);
      })
    );
  }

  createBooking(booking: Partial<Booking>): Observable<Booking> {
    if (this.useMockData) {
      return of({
        ...booking,
        id: Math.random().toString(36).substr(2, 9)
      } as Booking);
    }

    return this.httpClient.post<Booking>(this.apiUrl, booking);
  }

  updateBooking(bookingId: string, booking: Partial<Booking>): Observable<Booking> {
    if (this.useMockData) {
      return of({ ...booking, id: bookingId } as Booking);
    }

    return this.httpClient.put<Booking>(`${this.apiUrl}/${bookingId}`, booking);
  }

  deleteBooking(bookingId: string): Observable<void> {
    if (this.useMockData) {
      return of(void 0);
    }

    return this.httpClient.delete<void>(`${this.apiUrl}/${bookingId}`);
  }

  private getMockBookingsAsPaged(): Observable<PagedResultDto<Booking>> {
    return of({
      items: mockBookings,
      pageNumber: 1,
      pageSize: 10,
      totalCount: mockBookings.length
    } as PagedResultDto<Booking>);
  }
}
