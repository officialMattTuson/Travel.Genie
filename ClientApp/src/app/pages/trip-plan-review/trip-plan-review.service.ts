import { Injectable } from '@angular/core';
import { GeneratedTripPlanResponse } from '../../services/trip-planner.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TripPlanReviewService {

  private readonly _generatedTripPlan = new BehaviorSubject<GeneratedTripPlanResponse | null>(null);
  readonly generatedTripPlan$ = this._generatedTripPlan.asObservable();

  setTripPlan(generatedPlan: GeneratedTripPlanResponse): void {
    this._generatedTripPlan.next(generatedPlan);
  }

  getTripPlan(): GeneratedTripPlanResponse | null {
    return this._generatedTripPlan.getValue();
  }
}
