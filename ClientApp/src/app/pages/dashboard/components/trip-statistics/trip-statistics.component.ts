import { Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TripStatus } from '../../../../models/trip-type.model';
import { TripDetailDto } from '../../../../models/dtos/trip.dtos';

@Component({
  selector: 'app-trip-statistics',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './trip-statistics.component.html',
  styleUrl: './trip-statistics.component.scss',
})
export class TripStatisticsComponent {

  activeTrips = input.required<TripDetailDto[]>();
  completedTrips = input.required<TripDetailDto[]>();
  upcomingTrips = input.required<TripDetailDto[]>();

  totalDestinationsVisited = computed(() => {
    const visitedDestinations = new Set<string>();
    this.completedTrips().forEach(completedTrip => {
      if (completedTrip.primaryDestination) {
        visitedDestinations.add(completedTrip.primaryDestination.id);
      }
      completedTrip.destinations.forEach(destination => {
        visitedDestinations.add(destination.id);
      });
    });
    return visitedDestinations.size;
  });

  totalBudgetSpentOnTrips = computed(() => {
    return this.completedTrips().reduce((sum, trip) => {
      return sum + (trip.budget?.totalBudget || 0);
    }, 0)
  });

  averageTripDuration = computed(() => {
    const trips = this.completedTrips();
    if (trips.length === 0) return 0;

    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const totalDays = trips.reduce((sum, trip) => {
      return sum + (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / MS_PER_DAY;
    }, 0);

    return Math.round(totalDays / trips.length);
  });

  activeTripDays = computed(() => {
    const activeTrip = this.activeTrips().find((trip) => trip.status === TripStatus.InProgress);
    if (!activeTrip) return 0;
    const today = new Date();
    const endDate = new Date(activeTrip.endDate);
    return Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  });

}
