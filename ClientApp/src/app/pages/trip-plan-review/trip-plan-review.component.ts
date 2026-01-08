import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { GeneratedTripPlanResponse } from '../../services/trip-planner.service';
import { AlertService } from '../../services/alert.service';
import { TripPlanReviewService } from './trip-plan-review.service';

@Component({
  selector: 'app-trip-plan-review',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
  ],
  templateUrl: './trip-plan-review.component.html',
  styleUrl: './trip-plan-review.component.scss',
})
export class TripPlanReviewComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);
  private readonly tripPlanReviewService = inject(TripPlanReviewService);

  generatedPlan: GeneratedTripPlanResponse | null = null;
  isSaving = false;

  ngOnInit(): void {
    this.generatedPlan = this.tripPlanReviewService.getTripPlan();
    if (!this.generatedPlan) {
      this.alertService.displayError('No trip plan found. Please create a trip first.');
      this.router.navigate(['/create-trip']);
    }
  }

  formatCurrency(value: number | undefined): string {
    if (value === undefined || value === null) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }

  acceptAndSaveTrip(): void {
    if (!this.generatedPlan) {
      this.alertService.displayError('No trip plan to save.');
      return;
    }

    this.isSaving = true;
    // TODO: Call trip service to save the generated plan as an actual trip
    this.alertService.displaySuccess(
      `Trip "${this.generatedPlan.trip.name}" saved successfully!`
    );
    this.router.navigate(['/dashboard']);
  }

  editTrip(): void {
    // Return to create trip form with current values for editing
    this.router.navigate(['/create-trip']);
  }

  goBack(): void {
    this.router.navigate(['/create-trip']);
  }
}
