import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { TripDetailDto } from '../models/dtos/trip.dtos';
import { PagedResultDto } from '../models/dtos/common.dtos';
import { AiPlanRequestDto, AiPlanResponseDto } from '../models/dtos/ai.dtos';
import { mockTrips } from '../mocks/mock-trips';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private readonly apiUrl = '/api/trips';
  private useMockData = true;
  private readonly httpClient = inject(HttpClient);

  getTrips(pageNumber: number = 1, pageSize: number = 10): Observable<PagedResultDto<TripDetailDto>> {
    if (this.useMockData) {
      return this.getMockTripsAsPaged();
    }

    return this.httpClient.get<PagedResultDto<TripDetailDto>>(
      `${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    ).pipe(
      catchError((error) => {
        console.warn('API request failed, falling back to mock data', error);
        return this.getMockTripsAsPaged();
      })
    );
  }

  getTripDetail(tripId: string): Observable<TripDetailDto> {
    if (this.useMockData) {
      const trip = mockTrips.find(t => t.id === tripId);
      return trip ? of(trip) : of(mockTrips[0]);
    }

    return this.httpClient.get<TripDetailDto>(`${this.apiUrl}/${tripId}`).pipe(
      catchError(() => {
        const trip = mockTrips.find(t => t.id === tripId);
        return of(trip || mockTrips[0]);
      })
    );
  }

  CreateTrip(trip: Partial<TripDetailDto>): Observable<TripDetailDto> {
    if (this.useMockData) {
      return of({
        ...trip,
        id: Math.random().toString(36).substring(2, 11)
      } as TripDetailDto);
    }

    return this.httpClient.post<TripDetailDto>(this.apiUrl, trip);
  }

  updateTrip(tripId: string, trip: Partial<TripDetailDto>): Observable<TripDetailDto> {
    if (this.useMockData) {
      return of({ ...trip, id: tripId } as TripDetailDto);
    }

    return this.httpClient.put<TripDetailDto>(`${this.apiUrl}/${tripId}`, trip);
  }

  deleteTrip(tripId: string): Observable<void> {
    if (this.useMockData) {
      return of(void 0);
    }

    return this.httpClient.delete<void>(`${this.apiUrl}/${tripId}`);
  }

  generateAiPlan(request: AiPlanRequestDto): Observable<AiPlanResponseDto> {
    if (this.useMockData) {
      return of({
        proposalId: Math.random().toString(36).substring(2, 11),
        suggestedTripName: request.tripName || 'AI Generated Trip',
        suggestedBudget: {
          currencyCode: 'USD',
          totalBudget: 3000,
          dailyTarget: 300
        },
        suggestedDays: [],
        insights: [
          {
            title: 'Budget Tip',
            body: 'Consider visiting during shoulder season for better prices.',
            type: 'BudgetTip'
          }
        ]
      } as AiPlanResponseDto);
    }

    return this.httpClient.post<AiPlanResponseDto>(`${this.apiUrl}/ai/plan`, request);
  }

  private getMockTripsAsPaged(): Observable<PagedResultDto<TripDetailDto>> {
    return of({
      items: mockTrips,
      pageNumber: 1,
      pageSize: 10,
      totalCount: mockTrips.length
    } as PagedResultDto<TripDetailDto>);
  }
}
