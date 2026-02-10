import { Component, inject, computed, resource } from '@angular/core';
import { TripService } from '../../services/trip.service';
import { AlertService } from '../../services/alert.service';
import { BookingService } from '../../services/booking.service';
import { TripDetailsWithBookings } from '../../models/trip-details.model';
import { TripDetailDto, TripStatus } from '../../models/dtos/trip.dtos';
import { Booking } from '../../models/booking.model';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TripSummaryComponent } from './components/trip-summary/trip-summary.component';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TripStatisticsComponent } from './components/trip-statistics/trip-statistics.component';

export enum DashboardHeaderActions {
  PlanNewTrip = 'Plan New Trip',
  SavedPlaces = 'Saved Places',
  ProFeatures = 'Pro Features',
}

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, MatCardModule, MatIconModule, MatButtonModule, TripSummaryComponent, TripStatisticsComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  private readonly tripService = inject(TripService);
  private readonly alertService = inject(AlertService);
  private readonly bookingService = inject(BookingService);
  private readonly router = inject(Router);

  pageHeaderActions: Array<{ label: string; icon: string }> = [
    { label: DashboardHeaderActions.PlanNewTrip, icon: 'add_circle' },
    { label: DashboardHeaderActions.SavedPlaces, icon: 'bookmarks' },
    { label: DashboardHeaderActions.ProFeatures, icon: 'star' },
  ];

  // Using Resource API with observables converted to promise
  // tripsAndBookingsResource = resource({
  //   loader: () => {
  //     return firstValueFrom(
  //       combineLatest([
  //         this.tripService.getTrips(),
  //         this.bookingService.getBookings()
  //       ]).pipe(
  //         map(([pagedTrips, pagedBookings]) => 
  //           this.processTripsWithBookings(pagedTrips.items, pagedBookings.items || [])
  //         ),
  //         catchError((error) => {
  //           const message = error instanceof Error ? error.message : 'Unknown error occurred';
  //           this.alertService.displayError(`Failed to fetch trips: ${message}`);
  //           throw error;
  //         })
  //       )
  //     );
  //   }
  // });

  // Using Resource API using promises
  tripsAndBookingsResource = resource({
    loader: async () => {
      try {
        const pagedTrips = await firstValueFrom(this.tripService.getTrips());
        const pagedBookings = await firstValueFrom(this.bookingService.getBookings());
        return this.processTripsWithBookings(pagedTrips.items, pagedBookings.items || []);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        this.alertService.displayError(`Failed to fetch trips: ${message}`);
        throw error;
      }
    }
  });

  activeTrips = computed(() => {
    const trips = this.tripsAndBookingsResource.value();
    return trips?.filter((t) => t.trip.status === TripStatus.InProgress) || [];
  });

  plannedTrips = computed(() => {
    const trips = this.tripsAndBookingsResource.value();
    return trips?.filter((t) => t.trip.status === TripStatus.Planned) || [];
  });

  completedTrips = computed(() => {
    const trips = this.tripsAndBookingsResource.value();
    return trips?.filter((t) => t.trip.status === TripStatus.Completed) || [];
  });

  private processTripsWithBookings(trips: TripDetailDto[], bookings: Booking[]): TripDetailsWithBookings[] {
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
        this.navigateToCreateTripPage();
        break;
      case DashboardHeaderActions.SavedPlaces:
        this.handleSavedPlaces();
        break;
      case DashboardHeaderActions.ProFeatures:
        this.handleProFeatures();
        break;
    }
  }

  onQuickActionClick(action: string): void {
    switch (action) {
      case 'plan-trip':
        this.navigateToCreateTripPage();
        break;
      case 'add-booking':
        this.handleAddBooking();
        break;
      case 'generate-itinerary':
        this.handleGenerateItinerary();
        break;
      case 'check-flights':
        this.handleCheckFlights();
        break;
    }
  }

  private navigateToCreateTripPage(): void {
    this.router.navigate(['/create-trip']);
  }

  private handleAddBooking(): void {
    this.alertService.displaySuccess('Add Booking feature coming soon!');
  }

  private handleGenerateItinerary(): void {
    this.alertService.displaySuccess('AI Itinerary generation coming soon!');
  }

  private handleCheckFlights(): void {
    this.alertService.displaySuccess('Check Flights feature coming soon!');
  }

  private handleSavedPlaces(): void {
    this.alertService.displaySuccess('Saved Places feature coming soon!');
  }

  private handleProFeatures(): void {
    this.alertService.displaySuccess('Pro Features coming soon!');
  }
}
