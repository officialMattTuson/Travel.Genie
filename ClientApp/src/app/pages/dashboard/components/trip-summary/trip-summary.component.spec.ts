import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TripSummaryComponent} from './trip-summary.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {TripDetailsWithBookings} from '../../../../models/trip-details.model';
import {mockTrips} from "../../../../mocks/mock-trips";
import {mockBookings} from "../../../../mocks/mock-bookings";

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
    const trip = {...mockTrips[0]};
    trip.destination = 'Tokyo';
    trip.startDate = new Date(futureDate.getTime() + 86400000).toISOString(); // 1 day after futureDate
    trip.endDate = new Date(futureDate.getTime() + 432000000).toISOString(); // 5 days after futureDate
    const tripDetails: TripDetailsWithBookings = {
      trip: trip,
      bookings: mockBookings
    };

    fixture.componentRef.setInput('tripDetails', tripDetails);
    fixture.detectChanges();

    expect(component.isActive()).toBeFalse();
    expect(component.isPast()).toBeFalse();
    expect(component.numberOfDaysUntil()).toBeGreaterThan(0);

    const statusBadge = fixture.nativeElement.querySelector('.trip__status');
    expect(statusBadge.textContent).toContain('Upcoming');
  });

  it('should show active trip info if today is within start and end date', () => {
    const trip = {...mockTrips[0]};
    trip.destination = 'Paris';
    trip.startDate = pastDate.toISOString();
    trip.endDate = futureDate.toISOString();
    const tripDetails: TripDetailsWithBookings = {
      trip: trip,
      bookings: mockBookings
    };

    fixture.componentRef.setInput('tripDetails', tripDetails);
    fixture.detectChanges();

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
    const trip = {...mockTrips[0]};
    trip.destination = 'Barcelona';
    trip.startDate = farPastDate.toISOString();
    trip.endDate = pastDate.toISOString();
    trip.actualPrice = 1200;
    const tripDetails: TripDetailsWithBookings = {
      trip: trip,
      bookings: mockBookings
    };

    fixture.componentRef.setInput('tripDetails', tripDetails);
    fixture.detectChanges();

    expect(component.isActive()).toBeFalse();
    expect(component.isPast()).toBeTrue();
    expect(component.numberOfDaysUntil()).toBeNull();

    const statusBadge = fixture.nativeElement.querySelector('.trip__status--completed');
    expect(statusBadge?.textContent).toContain('Completed');

    const tripCompleted = fixture.nativeElement.querySelector('.trip--completed');
    expect(tripCompleted).toBeTruthy();

    const stats = fixture.nativeElement.querySelectorAll('.trip__stat-label');
    const labels = Array.from(stats as HTMLElement[]).map((el: HTMLElement) => el.textContent);
    expect(labels).toContain('Actual Cost');
  });

  it('should display correct number of days until for upcoming trip', () => {
    const trip = {...mockTrips[0]};
    const daysUntilTrip = 10;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + daysUntilTrip);
    trip.startDate = startDate.toISOString();
    trip.endDate = new Date(startDate.getTime() + 86400000 * 5).toISOString();

    const tripDetails: TripDetailsWithBookings = {
      trip: trip,
      bookings: mockBookings
    };

    fixture.componentRef.setInput('tripDetails', tripDetails);
    fixture.detectChanges();

    const daysValue = component.numberOfDaysUntil();
    expect(daysValue).toBeLessThanOrEqual(daysUntilTrip + 1);
    expect(daysValue).toBeGreaterThanOrEqual(daysUntilTrip - 1);
  });

  it('should display correct number of days left for active trip', () => {
    const trip = {...mockTrips[0]};
    const daysLeft = 3;
    trip.startDate = new Date(today.getTime() - 86400000 * 2).toISOString();
    trip.endDate = new Date(today.getTime() + 86400000 * daysLeft).toISOString();

    const tripDetails: TripDetailsWithBookings = {
      trip: trip,
      bookings: mockBookings
    };

    fixture.componentRef.setInput('tripDetails', tripDetails);
    fixture.detectChanges();

    const daysLeftValue = component.numberOfDaysLeft();
    expect(daysLeftValue).toBeLessThanOrEqual(daysLeft + 1);
    expect(daysLeftValue).toBeGreaterThanOrEqual(daysLeft - 1);
  });

  it('should render correct number of bookings', () => {
    const trip = {...mockTrips[0]};
    trip.startDate = futureDate.toISOString();
    trip.endDate = new Date(futureDate.getTime() + 432000000).toISOString();

    const tripDetails: TripDetailsWithBookings = {
      trip: trip,
      bookings: [mockBookings[0]]
    };

    fixture.componentRef.setInput('tripDetails', tripDetails);
    fixture.detectChanges();

    const bookingStats = fixture.nativeElement.querySelectorAll('.trip__stat-value');
    const bookingValue = bookingStats[1].textContent;
    expect(bookingValue).toContain('1');
  });

  it('should return null for numberOfDaysLeft when trip is not active', () => {
    const trip = {...mockTrips[0]};
    trip.startDate = futureDate.toISOString();
    trip.endDate = new Date(futureDate.getTime() + 432000000).toISOString();

    const tripDetails: TripDetailsWithBookings = {
      trip: trip,
      bookings: mockBookings
    };

    fixture.componentRef.setInput('tripDetails', tripDetails);
    fixture.detectChanges();

    expect(component.numberOfDaysLeft()).toBeNull();
  });

  it('should return null for tripProgress when trip is not active', () => {
    const trip = {...mockTrips[0]};
    trip.startDate = farPastDate.toISOString();
    trip.endDate = pastDate.toISOString();

    const tripDetails: TripDetailsWithBookings = {
      trip: trip,
      bookings: mockBookings
    };

    fixture.componentRef.setInput('tripDetails', tripDetails);
    fixture.detectChanges();

    expect(component.tripProgress()).toBeNull();
  });

  it('should compute correct trip progress percentage for active trip', () => {
    const trip = {...mockTrips[0]};
    const startDate = new Date(today.getTime() - 86400000 * 10);
    const endDate = new Date(today.getTime() + 86400000 * 5);
    trip.startDate = startDate.toISOString();
    trip.endDate = endDate.toISOString();

    const tripDetails: TripDetailsWithBookings = {
      trip: trip,
      bookings: mockBookings
    };

    fixture.componentRef.setInput('tripDetails', tripDetails);
    fixture.detectChanges();

    const progress = component.tripProgress();
    expect(progress).toBeLessThanOrEqual(100);
    expect(progress).toBeGreaterThan(0);
  });

  it('should compute correct startDate and endDate', () => {
    const trip = {...mockTrips[0]};
    const startDate = new Date(today.getTime() - 86400000 * 2);
    const endDate = new Date(today.getTime() + 86400000 * 5);
    trip.startDate = startDate.toISOString();
    trip.endDate = endDate.toISOString();

    const tripDetails: TripDetailsWithBookings = {
      trip: trip,
      bookings: mockBookings
    };

    fixture.componentRef.setInput('tripDetails', tripDetails);
    fixture.detectChanges();

    const computedStartDate = component.startDate();
    const computedEndDate = component.endDate();

    expect(computedStartDate.getTime()).toBeCloseTo(startDate.getTime(), -3);
    expect(computedEndDate.getTime()).toBeCloseTo(endDate.getTime(), -3);
  });
});
