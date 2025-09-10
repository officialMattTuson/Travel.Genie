import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TripDetails } from '../models/trip-details.model';
import { mockTrips } from '../mocks/mock-trips';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  constructor() { }

  getTrips(): Observable<TripDetails[]> {
    return of(mockTrips);
  }
}
