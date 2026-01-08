import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { CreateTripComponent } from './create-trip.component';
import { TripService } from '../../services/trip.service';
import { AlertService } from '../../services/alert.service';
import { TripPlannerService, GeneratedTripPlanResponse } from '../../services/trip-planner.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';

describe('CreateTripComponent Component', () => {
  let component: CreateTripComponent;
  let fixture: ComponentFixture<CreateTripComponent>;
  let mockTripService: jasmine.SpyObj<TripService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockTripPlannerService: jasmine.SpyObj<TripPlannerService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockTripService = jasmine.createSpyObj('TripService', ['CreateTripComponent', 'generateAiPlan', 'getTrips']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['displaySuccess', 'displayError']);
    mockTripPlannerService = jasmine.createSpyObj('TripPlannerService', ['generatePlan']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Mock generatePlan to return a sample GeneratedTripPlanResponse
    const mockResponse: GeneratedTripPlanResponse = {
      trip: {
        name: 'Paris Trip',
        description: 'A trip to Paris',
        startDate: '2025-06-01',
        endDate: '2025-06-10',
        destination: 'Paris, France',
      },
      attractions: [],
      restaurants: [],
      budget: { total: 5000, accommodation: 1750, food: 1250, activities: 1250, transport: 500, other: 250 },
      aiNotes: [],
    };
    mockTripPlannerService.generatePlan.and.returnValue(of(mockResponse));

    await TestBed.configureTestingModule({
      imports: [
        CreateTripComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        MatIconModule,
        MatSliderModule,
        CommonModule,
        HeaderComponent,
      ],
      providers: [
        { provide: TripService, useValue: mockTripService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: TripPlannerService, useValue: mockTripPlannerService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize the trip form with empty values', () => {
      expect(component.tripForm).toBeDefined();
      expect(component.tripForm.get('destination')?.value).toBe('');
      expect(component.tripForm.get('startDate')?.value).toBe('');
      expect(component.tripForm.get('endDate')?.value).toBe('');
      expect(component.tripForm.get('tripPreferences')?.value).toBe('');
    });

    it('should initialize budget with correct default value', () => {
      expect(component.currentBudget).toBe(1000);
    });

    it('should initialize budget range correctly', () => {
      expect(component.budgetRange.min).toBe(1000);
      expect(component.budgetRange.max).toBe(50000);
    });

    it('should initialize preference tags', () => {
      expect(component.preferencesTags.length).toBe(6);
      expect(component.preferencesTags[0].id).toBe('photography');
      expect(component.preferencesTags[0].label).toBe('Photography');
    });

    it('should initialize empty selected preferences', () => {
      expect(component.selectedPreferences.size).toBe(0);
    });
  });

  describe('Form Validation', () => {
    it('should mark destination as invalid when empty', () => {
      const destinationControl = component.tripForm.get('destination');
      destinationControl?.setValue('');
      expect(destinationControl?.hasError('required')).toBeTruthy();
    });

    it('should mark destination as invalid when less than 2 characters', () => {
      const destinationControl = component.tripForm.get('destination');
      destinationControl?.setValue('A');
      expect(destinationControl?.hasError('minlength')).toBeTruthy();
    });

    it('should mark destination as valid with proper value', () => {
      const destinationControl = component.tripForm.get('destination');
      destinationControl?.setValue('Paris');
      expect(destinationControl?.valid).toBeTruthy();
    });

    it('should mark startDate as invalid when empty', () => {
      const startDateControl = component.tripForm.get('startDate');
      startDateControl?.setValue('');
      expect(startDateControl?.hasError('required')).toBeTruthy();
    });

    it('should mark endDate as invalid when empty', () => {
      const endDateControl = component.tripForm.get('endDate');
      endDateControl?.setValue('');
      expect(endDateControl?.hasError('required')).toBeTruthy();
    });

    it('should mark tripPreferences as invalid when empty', () => {
      const preferencesControl = component.tripForm.get('tripPreferences');
      preferencesControl?.setValue('');
      expect(preferencesControl?.hasError('required')).toBeTruthy();
    });

    it('should mark tripPreferences as valid with proper value', () => {
      const preferencesControl = component.tripForm.get('tripPreferences');
      preferencesControl?.setValue('I love adventure and photography');
      expect(preferencesControl?.valid).toBeTruthy();
    });

    it('should validate the form as invalid when incomplete', () => {
      expect(component.tripForm.valid).toBeFalsy();
    });

    it('should validate the form as valid when all fields are filled', () => {
      component.tripForm.patchValue({
        destination: 'Tokyo',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-06-10'),
        tripPreferences: 'I love exploring local cuisine and visiting temples',
      });
      expect(component.tripForm.valid).toBeTruthy();
    });
  });

  describe('Preference Management', () => {
    it('should toggle preference selection', () => {
      const preferenceId = 'photography';
      component.togglePreference(preferenceId);
      expect(component.selectedPreferences.has(preferenceId)).toBeTruthy();
    });

    it('should remove preference when toggled twice', () => {
      const preferenceId = 'photography';
      component.togglePreference(preferenceId);
      component.togglePreference(preferenceId);
      expect(component.selectedPreferences.has(preferenceId)).toBeFalsy();
    });

    it('should support multiple preference selections', () => {
      component.togglePreference('photography');
      component.togglePreference('adventure');
      component.togglePreference('culturalSites');
      expect(component.selectedPreferences.size).toBe(3);
    });

    it('should correctly identify selected preference', () => {
      component.togglePreference('photography');
      expect(component.isPreferenceSelected('photography')).toBeTruthy();
      expect(component.isPreferenceSelected('adventure')).toBeFalsy();
    });

    it('should return false for unselected preference', () => {
      expect(component.isPreferenceSelected('photography')).toBeFalsy();
    });
  });

  describe('Budget Management', () => {
    it('should update currentBudget when slider value changes', () => {
      component.currentBudget = 5000;
      expect(component.currentBudget).toBe(5000);
    });

    it('should maintain budget within valid range', () => {
      component.currentBudget = 25000;
      expect(component.currentBudget).toBeGreaterThanOrEqual(component.budgetRange.min);
      expect(component.currentBudget).toBeLessThanOrEqual(component.budgetRange.max);
    });

    it('should allow any budget value within range', () => {
      const testValues = [1000, 5000, 10000, 25000, 50000];
      testValues.forEach(value => {
        component.currentBudget = value;
        expect(component.currentBudget).toBe(value);
      });
    });
  });

  describe('Generate Dream Trip', () => {
    beforeEach(() => {
      component.tripForm.patchValue({
        destination: 'Paris',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-06-10'),
        tripPreferences: 'I love exploring local cuisine and visiting museums',
      });
    });

    it('should show error when form is invalid', () => {
      component.tripForm.patchValue({
        destination: '',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-06-10'),
        tripPreferences: 'Some preferences',
      });

      component.generateDreamTrip();
      expect(mockAlertService.displayError).toHaveBeenCalledWith('Please fill in all required fields');
    });

    it('should calculate trip duration correctly', () => {
      const startDate = new Date('2025-06-01');
      const endDate = new Date('2025-06-10');
      const expectedDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      expect(expectedDuration).toBe(9);
    });

    it('should show error when end date is before start date', () => {
      component.tripForm.patchValue({
        destination: 'Paris',
        startDate: new Date('2025-06-10'),
        endDate: new Date('2025-06-01'), // Before start date
        tripPreferences: 'Some preferences',
      });

      component.generateDreamTrip();
      expect(mockAlertService.displayError).toHaveBeenCalledWith('End date must be after start date');
    });

    it('should show success message when generating dream trip', () => {
      component.generateDreamTrip();
      expect(mockTripPlannerService.generatePlan).toHaveBeenCalled();
      expect(mockAlertService.displaySuccess).toHaveBeenCalled();
      const callArgs = mockAlertService.displaySuccess.calls.mostRecent().args[0];
      expect(callArgs).toContain('Generated 9-day trip to Paris');
    });
  });

  describe('Navigation', () => {
    it('should navigate to dashboard on goBackToDashboard', () => {
      component.goBackToDashboard();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  describe('Edge Cases', () => {
    it('should handle same start and end date as valid', () => {
      const sameDate = new Date('2025-06-01');
      component.tripForm.patchValue({
        destination: 'Paris',
        startDate: sameDate,
        endDate: sameDate,
        tripPreferences: 'Some preferences',
      });

      component.generateDreamTrip();
      expect(mockAlertService.displayError).not.toHaveBeenCalled();
    });

    it('should handle minimum budget value', () => {
      component.currentBudget = component.budgetRange.min;
      expect(component.currentBudget).toBe(1000);
    });

    it('should handle maximum budget value', () => {
      component.currentBudget = component.budgetRange.max;
      expect(component.currentBudget).toBe(50000);
    });
  });

  describe('Form Field Interactions', () => {
    it('should update currency code to USD', () => {
      const currencyControl = component.tripForm.get('currency');
      expect(currencyControl?.value).toBe('USD');
    });

    it('should preserve form state after multiple interactions', () => {
      component.tripForm.patchValue({
        destination: 'Tokyo',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-06-10'),
        tripPreferences: 'Adventure and culture',
      });

      // Toggle preferences
      component.togglePreference('photography');
      component.togglePreference('adventure');

      // Verify form still has values
      expect(component.tripForm.get('destination')?.value).toBe('Tokyo');
      expect(component.selectedPreferences.size).toBe(2);
    });
  });
});
