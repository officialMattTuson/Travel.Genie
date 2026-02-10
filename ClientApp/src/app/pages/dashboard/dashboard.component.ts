import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { TripService } from '../../services/trip.service';
import { map, switchMap, take, tap } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
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

export enum DashboardHeaderActions {
  PlanNewTrip = 'Plan New Trip',
  SavedPlaces = 'Saved Places',
  ProFeatures = 'Pro Features',
}

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, MatCardModule, MatIconModule, MatButtonModule, TripSummaryComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private readonly tripService = inject(TripService);
  private readonly alertService = inject(AlertService);
  private readonly bookingService = inject(BookingService);
  private readonly router = inject(Router);

  activeTrips = signal<TripDetailsWithBookings[]>([]);
  plannedTrips = signal<TripDetailsWithBookings[]>([]);
  completedTrips = signal<TripDetailsWithBookings[]>([]);
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
        tap((pagedTrips) => {
          console.log('Fetched trips:', pagedTrips);
        }),
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
        next: (tripsWithBookings) => {
          console.log(tripsWithBookings)
          this.separateTripsByStatus(tripsWithBookings);
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.displayError(`Failed to fetch trips: ${error.message}`);
        },
      });
  }

  private processTripsWithBookings(trips: TripDetailDto[], bookings: Booking[]): TripDetailsWithBookings[] {
    const tripsWithBookings: TripDetailsWithBookings[] = [];
    trips.forEach((trip) => {
      const tripBookings = bookings.filter((booking) => booking.tripId === trip.id);
      tripsWithBookings.push({ trip: trip, bookings: tripBookings });
    });
    return tripsWithBookings;
  }

  private separateTripsByStatus(tripsWithBookings: TripDetailsWithBookings[]): void {
    this.activeTrips.set(tripsWithBookings.filter((t) => t.trip.status === TripStatus.InProgress));
    this.plannedTrips.set(tripsWithBookings.filter((t) => t.trip.status === TripStatus.Planned));
    this.completedTrips.set(tripsWithBookings.filter((t) => t.trip.status === TripStatus.Completed));
  }

  // Travel Statistics - Computed Properties
  totalTripsCompleted = computed(() => this.completedTrips().length);

  totalDestinationsVisited = computed(() => {
    const uniqueDestinations = new Set<string>();
    this.completedTrips().forEach((tripWithBookings) => {
      tripWithBookings.trip.destinations.forEach((dest) => {
        uniqueDestinations.add(dest.id);
      });
    });
    return uniqueDestinations.size;
  });

  totalBudgetSpentOnTrips = computed(() => {
    return this.completedTrips().reduce((sum, tripWithBookings) => {
      return sum + (tripWithBookings.trip.budget?.totalBudget || 0);
    }, 0);
  });

  averageTripDuration = computed(() => {
    if (this.completedTrips().length === 0) return 0;
    const totalDays = this.completedTrips().reduce((sum, tripWithBookings) => {
      const startDate = new Date(tripWithBookings.trip.startDate);
      const endDate = new Date(tripWithBookings.trip.endDate);
      const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return sum + durationDays;
    }, 0);
    return Math.round(totalDays / this.completedTrips().length);
  });

  totalBookings = computed(() => {
    return this.completedTrips().reduce((sum, tripWithBookings) => {
      return sum + tripWithBookings.bookings.length;
    }, 0);
  });

  upcomingTrips = computed(() => {
    return this.plannedTrips().length;
  });

  activeTripDays = computed(() => {
    const activeTrip = this.activeTrips().find((t) => t.trip.status === TripStatus.InProgress);
    if (!activeTrip) return 0;
    const today = new Date();
    const endDate = new Date(activeTrip.trip.endDate);
    return Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  });

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
