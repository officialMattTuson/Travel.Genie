import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GenerateTripPlanRequest {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  preferenceTags: string[];
}

export interface AttractionDto {
  name: string;
  description: string;
  category?: string;
  estimatedCost?: number;
}

export interface RestaurantDto {
  name: string;
  cuisine: string;
  description: string;
  specialty?: string;
  estimatedCost?: number;
}

export interface BudgetBreakdown {
  total: number;
  accommodation: number;
  food: number;
  activities: number;
  transport: number;
  other: number;
}

export interface TripDraft {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  destination: string;
}

export interface GeneratedTripPlanResponse {
  trip: TripDraft;
  attractions: AttractionDto[];
  restaurants: RestaurantDto[];
  budget: BudgetBreakdown;
  aiNotes: string[];
}

@Injectable({
  providedIn: 'root',
})
export class TripPlannerService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/trip-planner';

  generatePlan(request: GenerateTripPlanRequest): Observable<GeneratedTripPlanResponse> {
    return this.http.post<GeneratedTripPlanResponse>(
      `${this.apiUrl}/generate`,
      request
    );
  }
}
