import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripSummaryComponent } from './trip-summary.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { mockTrips } from "../../../../mocks/mock-trips";
import { TripDetailDto } from '../../../../models/dtos/trip.dtos';

describe('TripSummaryComponent', () => {
  let component: TripSummaryComponent;
  let fixture: ComponentFixture<TripSummaryComponent>;

  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + 5);

  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - 5);

  const farPastDate = new Date(today);
  farPastDate.setDate(today.getDate() - 15);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripSummaryComponent, MatProgressBarModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TripSummaryComponent);
    component = fixture.componentInstance;
  });

  it('should show upcoming trip info if start date is in the future', () => {
    // Arrange
    const trip = { ...mockTrips[0] };
    trip.destinations = [
      {
        id: 'dest-1',
        name: 'Paris',
        countryCode: 'FR',
      }
    ];
    trip.startDate = new Date(futureDate.getTime() + 86400000).toISOString(); // 1 day after futureDate
    trip.endDate = new Date(futureDate.getTime() + 432000000).toISOString(); // 5 days after futureDate

    // Act
    fixture.componentRef.setInput('tripDetails', trip);
    fixture.detectChanges();

    // Assert
    expect(component.isActive()).toBeFalse();
    expect(component.isPast()).toBeFalse();
    expect(component.numberOfDaysUntil()).toBeGreaterThan(0);

    const statusBadge = fixture.nativeElement.querySelector('.trip__status');
    expect(statusBadge.textContent).toContain('Upcoming');
  });

  it('should show active trip info if today is within start and end date', () => {
    // Arrange
    const trip = { ...mockTrips[0] };
    trip.destinations = [
      {
        id: 'dest-1',
        name: 'Paris',
        countryCode: 'FR',
      }
    ];
    trip.startDate = pastDate.toISOString();
    trip.endDate = futureDate.toISOString();

    // Act
    fixture.componentRef.setInput('tripDetails', trip);
    fixture.detectChanges();

    // Assert
    expect(component.isActive()).toBeTrue();
    expect(component.isPast()).toBeFalse();
    expect(component.numberOfDaysLeft()).toBeGreaterThan(0);
    expect(component.tripProgress()).toBeGreaterThan(0);

    const progressBar = fixture.nativeElement.querySelector('mat-progress-bar');
    expect(progressBar).toBeTruthy();

    const statusBadge = fixture.nativeElement.querySelector('.trip__status');
    expect(statusBadge.textContent).toContain('Active');
  });

  it('should show completed trip info if end date is in the past', () => {
    // Arrange
    const trip = { ...mockTrips[0] };
    trip.destinations = [
      {
        id: 'dest-1',
        name: 'Paris',
        countryCode: 'FR',
      }
    ];
    trip.startDate = farPastDate.toISOString();
    trip.endDate = pastDate.toISOString();
    trip.budget = { currencyCode: 'EUR', totalBudget: 1200 };

    // Act
    fixture.componentRef.setInput('tripDetails', trip);
    fixture.detectChanges();

    // Assert
    expect(component.isActive()).toBeFalse();
    expect(component.isPast()).toBeTrue();
    expect(component.numberOfDaysUntil()).toBeNull();

    const statusBadge = fixture.nativeElement.querySelector('.trip__status--completed');
    expect(statusBadge?.textContent).toContain('Completed');

    const tripCompleted = fixture.nativeElement.querySelector('.trip--completed');
    expect(tripCompleted).toBeTruthy();

    const stats = fixture.nativeElement.querySelectorAll('.trip__stat-label');
    const labels = Array.from(stats as HTMLElement[]).map((el: HTMLElement) => el.textContent);
    expect(labels).toEqual([ 'Duration', 'Destinations', 'Budget']);
  });

  it('should display correct number of days until for upcoming trip', () => {
    // Arrange
    const trip = { ...mockTrips[0] };
    const daysUntilTrip = 10;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + daysUntilTrip);
    trip.startDate = startDate.toISOString();
    trip.endDate = new Date(startDate.getTime() + 86400000 * 5).toISOString();

    // Act
    fixture.componentRef.setInput('tripDetails', trip);
    fixture.detectChanges();

    // Assert
    const daysValue = component.numberOfDaysUntil();
    expect(daysValue).toBeLessThanOrEqual(daysUntilTrip + 1);
    expect(daysValue).toBeGreaterThanOrEqual(daysUntilTrip - 1);
  });

  it('should display correct number of days left for active trip', () => {
    // Arrange
    const trip = { ...mockTrips[0] };
    const daysLeft = 3;
    trip.startDate = new Date(today.getTime() - 86400000 * 2).toISOString();
    trip.endDate = new Date(today.getTime() + 86400000 * daysLeft).toISOString();

    // Act
    fixture.componentRef.setInput('tripDetails', trip);
    fixture.detectChanges();

    // Assert
    const daysLeftValue = component.numberOfDaysLeft();
    expect(daysLeftValue).toBeLessThanOrEqual(daysLeft + 1);
    expect(daysLeftValue).toBeGreaterThanOrEqual(daysLeft - 1);
  });


  it('should return null for numberOfDaysLeft when trip is not active', () => {
    // Arrange
    const trip = { ...mockTrips[0] };
    trip.startDate = futureDate.toISOString();
    trip.endDate = new Date(futureDate.getTime() + 432000000).toISOString();

    // Act
    fixture.componentRef.setInput('tripDetails', trip);
    fixture.detectChanges();

    // Assert
    expect(component.numberOfDaysLeft()).toBeNull();
  });

  it('should return null for tripProgress when trip is not active', () => {
    // Arrange
    const trip = { ...mockTrips[0] };
    trip.startDate = farPastDate.toISOString();
    trip.endDate = pastDate.toISOString();

    // Act
    fixture.componentRef.setInput('tripDetails', trip);
    fixture.detectChanges();

    // Assert
    expect(component.tripProgress()).toBeNull();
  });

  it('should compute correct trip progress percentage for active trip', () => {
    // Arrange
    const trip = { ...mockTrips[0] };
    const startDate = new Date(today.getTime() - 86400000 * 10);
    const endDate = new Date(today.getTime() + 86400000 * 5);
    trip.startDate = startDate.toISOString();
    trip.endDate = endDate.toISOString();

    // Act
    fixture.componentRef.setInput('tripDetails', trip);
    fixture.detectChanges();

    // Assert
    const progress = component.tripProgress();
    expect(progress).toBeLessThanOrEqual(100);
    expect(progress).toBeGreaterThan(0);
  });

  it('should compute correct startDate and endDate', () => {
    // Arrange
    const trip = { ...mockTrips[0] };
    const startDate = new Date(today.getTime() - 86400000 * 2);
    const endDate = new Date(today.getTime() + 86400000 * 5);
    trip.startDate = startDate.toISOString();
    trip.endDate = endDate.toISOString();

    // Act
    fixture.componentRef.setInput('tripDetails', trip);
    fixture.detectChanges();

    const computedStartDate = component.startDate();
    const computedEndDate = component.endDate();

    // Assert
    expect(computedStartDate.getTime()).toBeCloseTo(startDate.getTime(), -3);
    expect(computedEndDate.getTime()).toBeCloseTo(endDate.getTime(), -3);
  });
});
