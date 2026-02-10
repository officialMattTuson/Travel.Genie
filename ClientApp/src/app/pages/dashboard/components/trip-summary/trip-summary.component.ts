import {Component, input, computed} from '@angular/core';
import {TripDetailsWithBookings} from "../../../../models/trip-details.model";
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'app-trip-summary',
  imports: [MatProgressBarModule],
  templateUrl: './trip-summary.component.html',
  styleUrls: ['./trip-summary.component.scss']
})
export class TripSummaryComponent {

  tripDetails = input.required<TripDetailsWithBookings>();

  isActive = computed(() => {
    const today = new Date();
    const { startDate, endDate } = this.tripDetails().trip;
    return today >= new Date(startDate) && today <= new Date(endDate);
  });

  isPast = computed(() => {
    const today = new Date();
    const endDate = new Date(this.tripDetails().trip.endDate);
    return today > endDate;
  });

  numberOfDaysUntil = computed(() => {
    if (this.isActive() || this.isPast()) return null;
    const today = new Date();
    const startDate = new Date(this.tripDetails().trip.startDate);
    return Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  });

  numberOfDaysLeft = computed(() => {
    if (!this.isActive()) return null;
    const today = new Date();
    const endDate = new Date(this.tripDetails().trip.endDate);
    return Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  });

  tripProgress = computed(() => {
    if (!this.isActive()) return null;
    const today = new Date();
    const startDate = new Date(this.tripDetails().trip.startDate);
    const endDate = new Date(this.tripDetails().trip.endDate);
    const numberOfDaysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const totalTripDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return ((totalTripDays - numberOfDaysLeft) / totalTripDays) * 100;
  });

  tripDuration = computed(() => {
    const startDate = new Date(this.tripDetails().trip.startDate);
    const endDate = new Date(this.tripDetails().trip.endDate);
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  });

  destinationCount = computed(() => {
    return this.tripDetails().trip?.destinations?.length;
  });

  startDate = computed(() => new Date(this.tripDetails().trip.startDate));
  endDate = computed(() => new Date(this.tripDetails().trip.endDate));
}
