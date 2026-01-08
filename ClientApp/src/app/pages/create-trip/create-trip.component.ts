import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';
import { GenerateTripPlanRequest, TripPlannerService } from '../../services/trip-planner.service';
import { TripPlanReviewService } from '../trip-plan-review/trip-plan-review.service';

export interface PreferenceTag {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-create-trip',
  standalone: true,
  imports: [
    HeaderComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.scss'],
})
export class CreateTripComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);
  private readonly tripPlannerService = inject(TripPlannerService);
  private readonly tripPlanReviewService = inject(TripPlanReviewService);

  tripForm!: FormGroup;
  selectedPreferences: Set<string> = new Set();
  budgetRange = { min: 1000, max: 50000 };
  currentBudget = 1000;
  isGenerating = false;

  preferencesTags: PreferenceTag[] = [
    { id: 'photography', label: 'Photography', icon: 'photo_camera' },
    { id: 'luxuryHotels', label: 'Luxury Hotels', icon: 'star' },
    { id: 'familyFriendly', label: 'Family-Friendly', icon: 'family_restroom' },
    { id: 'adventure', label: 'Adventure', icon: 'hiking' },
    { id: 'culturalSites', label: 'Cultural Sites', icon: 'museum' },
    { id: 'nightlife', label: 'Nightlife', icon: 'nightlife' },
  ];

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.tripForm = this.fb.group({
      destination: ['', [Validators.required, Validators.minLength(2)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      budget: [3000, [Validators.required, Validators.min(1000)]],
      currency: ['USD', Validators.required],
      tripPreferences: ['', Validators.required],
    });
  }

  togglePreference(preferenceId: string): void {
    if (this.selectedPreferences.has(preferenceId)) {
      this.selectedPreferences.delete(preferenceId);
    } else {
      this.selectedPreferences.add(preferenceId);
    }
  }

  isPreferenceSelected(preferenceId: string): boolean {
    return this.selectedPreferences.has(preferenceId);
  }

  generateDreamTrip(): void {
    if (this.tripForm.invalid) {
      this.alertService.displayError('Please fill in all required fields');
      return;
    }

    const destination = this.tripForm.get('destination')?.value;
    const startDate = this.tripForm.get('startDate')?.value;
    const endDate = this.tripForm.get('endDate')?.value;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (duration < 0) {
      this.alertService.displayError('End date must be after start date');
      return;
    }

    this.isGenerating = true;

    const request: GenerateTripPlanRequest = {
      destination,
      startDate: this.formatDateForApi(startDate),
      endDate: this.formatDateForApi(endDate),
      budget: this.currentBudget,
      currency: this.tripForm.get('currency')?.value || 'USD',
      preferenceTags: Array.from(this.selectedPreferences),
    };

    this.generatePlan(request, destination, duration);
  }

  private generatePlan(request: GenerateTripPlanRequest, destination: string, duration: number): void {
    this.tripPlannerService.generatePlan(request).subscribe({
      next: (generatedPlan) => {
        this.isGenerating = false;
        this.alertService.displaySuccess(`Generated ${duration}-day trip to ${destination}!`);
        this.tripPlanReviewService.setTripPlan(generatedPlan);
        this.router.navigate(['/trips/plan/preview']);
      },
      error: (error) => {
        this.isGenerating = false;
        console.error('Error generating trip plan:', error);
        this.alertService.displayError('Failed to generate trip plan. Please try again.');
      },
    });
  }

  private formatDateForApi(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  goBackToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
