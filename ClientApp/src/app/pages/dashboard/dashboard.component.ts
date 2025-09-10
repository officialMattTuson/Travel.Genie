import { Component, inject, OnInit } from '@angular/core';
import { TripService } from '../../services/trip.service';
import { map, switchMap, take } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BookingService } from '../../services/booking.service';
import { TripDetailsWithBookings, TripDetails } from '../../models/trip-details.model';
import { Booking } from '../../models/booking.model';
import { HeaderComponent } from '../../shared/components/header/header.component';

export enum DashboardHeaderActions {
  PlanNewTrip = 'Plan New Trip',
  SavedPlaces = 'Saved Places',
  ProFeatures = 'Pro Features',
}
@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private readonly tripService = inject(TripService);
  private readonly alertService = inject(AlertService);
  private readonly bookingService = inject(BookingService);

  trips: TripDetailsWithBookings[] = [];
  pageHeaderActions: Array<{ label: string; icon: string }> = [
    { label: DashboardHeaderActions.PlanNewTrip, icon: 'add_circle' },
    { label: DashboardHeaderActions.SavedPlaces, icon: 'bookmarks' },
    { label: DashboardHeaderActions.ProFeatures, icon: 'star' },
  ];

  ngOnInit(): void {
    this.getTripsAndBookings();
  }

  getTripsAndBookings(): void {
    this.tripService
      .getTrips()
      .pipe(
        take(1),
        switchMap((trips) => this.bookingService.getBookings().pipe(map((bookings) => this.processTripsWithBookings(trips, bookings))))
      )
      .subscribe({
        next: (trips) => {
          this.trips = trips;
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.displayError(`Failed to fetch trips: ${error.error.message}`);
        },
      });
  }

  private processTripsWithBookings(trips: TripDetails[], bookings: Booking[]): TripDetailsWithBookings[] {
    const tripsWithBookings: TripDetailsWithBookings[] = [];
    trips.forEach((trip) => {
      const tripBookings = bookings.filter((booking) => booking.tripId === trip.id);
      tripsWithBookings.push({ trip: trip, bookings: tripBookings });
    });
    return tripsWithBookings;
  }

  onHeaderActionClick(actionLabel: string): void {
    switch (actionLabel) {
      case DashboardHeaderActions.PlanNewTrip:
        // Handle Plan New Trip action
        break;
      case DashboardHeaderActions.SavedPlaces:
        // Handle Saved Places action
        break;
      case DashboardHeaderActions.ProFeatures:
        // Handle Pro Features action
        break;
    }
  }
}
