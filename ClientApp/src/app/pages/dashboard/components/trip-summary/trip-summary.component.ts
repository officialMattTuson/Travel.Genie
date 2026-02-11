import {Component, input, computed} from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { TripDetailDto } from '../../../../models/dtos/trip.dtos';

@Component({
  selector: 'app-trip-summary',
  imports: [MatProgressBarModule],
  templateUrl: './trip-summary.component.html',
  styleUrls: ['./trip-summary.component.scss']
})
export class TripSummaryComponent {

  tripDetails = input.required<TripDetailDto>();

  isActive = computed(() => {
    const today = new Date();
    const { startDate, endDate } = this.tripDetails();
    return today >= new Date(startDate) && today <= new Date(endDate);
  });

  isPast = computed(() => {
    const today = new Date();
    const endDate = new Date(this.tripDetails().endDate);
    return today > endDate;
  });

  numberOfDaysUntil = computed(() => {
    if (this.isActive() || this.isPast()) return null;
    const today = new Date();
    const startDate = new Date(this.tripDetails().startDate);
    return Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  });

  numberOfDaysLeft = computed(() => {
    if (!this.isActive()) return null;
    const today = new Date();
    const endDate = new Date(this.tripDetails().endDate);
    return Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  });

  tripProgress = computed(() => {
    if (!this.isActive()) return null;
    const today = new Date();
    const startDate = new Date(this.tripDetails().startDate);
    const endDate = new Date(this.tripDetails().endDate);
    const numberOfDaysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const totalTripDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return ((totalTripDays - numberOfDaysLeft) / totalTripDays) * 100;
  });

  tripDuration = computed(() => {
    const startDate = new Date(this.tripDetails().startDate);
    const endDate = new Date(this.tripDetails().endDate);
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  });

  destinationCount = computed(() => {
    const otherDestinationsLength = this.tripDetails().destinations?.length ?? 0;
    const primaryDestinationCount = this.tripDetails().primaryDestination ? 1 : 0;
    return primaryDestinationCount + otherDestinationsLength;
  });

  startDate = computed(() => new Date(this.tripDetails().startDate));
  endDate = computed(() => new Date(this.tripDetails().endDate));
}
