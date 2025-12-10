import {Component, inject, OnInit} from '@angular/core';
import {TripService} from '../../services/trip.service';
import {map, switchMap, take} from 'rxjs';
import {AlertService} from '../../services/alert.service';
import {HttpErrorResponse} from '@angular/common/http';
import {BookingService} from '../../services/booking.service';
import {TripDetailsWithBookings} from '../../models/trip-details.model';
import {TripDetailDto} from '../../models/dtos/trip.dtos';
import {Booking} from '../../models/booking.model';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {TripSummaryComponent} from './components/trip-summary/trip-summary.component';

export enum DashboardHeaderActions {
  PlanNewTrip = 'Plan New Trip',
  SavedPlaces = 'Saved Places',
  ProFeatures = 'Pro Features',
}

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, MatCardModule, MatIconModule, TripSummaryComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private readonly tripService = inject(TripService);
  private readonly alertService = inject(AlertService);
  private readonly bookingService = inject(BookingService);

  trips: TripDetailsWithBookings[] = [];
  pageHeaderActions: Array<{ label: string; icon: string }> = [
    {label: DashboardHeaderActions.PlanNewTrip, icon: 'add_circle'},
    {label: DashboardHeaderActions.SavedPlaces, icon: 'bookmarks'},
    {label: DashboardHeaderActions.ProFeatures, icon: 'star'},
  ];

  ngOnInit(): void {
    this.getTripsAndBookings();
  }

  getTripsAndBookings(): void {
    this.tripService
      .getTrips()
      .pipe(
        take(1),
        switchMap((pagedTrips) => {
          const trips = pagedTrips.items;
          return this.bookingService.getBookings().pipe(
            map((pagedBookings) => {
              const bookings = pagedBookings.items || [];
              return this.processTripsWithBookings(trips, bookings);
            })
          );
        })
      )
      .subscribe({
        next: (trips) => {
          console.log(trips)
          this.trips = trips;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching trips and bookings:', error);
          this.alertService.displayError(`Failed to fetch trips: ${error.error.message}`);
        },
      });
  }

  private processTripsWithBookings(trips: TripDetailDto[], bookings: Booking[]): TripDetailsWithBookings[] {
    const tripsWithBookings: TripDetailsWithBookings[] = [];
    trips.forEach((trip) => {
      const tripBookings = bookings.filter((booking) => booking.tripId === trip.id);
      tripsWithBookings.push({trip: trip, bookings: tripBookings});
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
