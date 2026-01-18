import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { TripService } from '../../services/trip.service';
import { BookingService } from '../../services/booking.service';
import { AlertService } from '../../services/alert.service';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { mockPagedTripResults, mockTrips } from '../../mocks/mock-trips';
import { mockPagedBookingResults } from '../../mocks/mock-bookings';
import { Router } from '@angular/router';
import { TripDetailsWithBookings } from '../../models/trip-details.model';
import { TripDetailDto } from '../../models/dtos/trip.dtos';
import { PagedResultDto } from '../../models/dtos/common.dtos';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let tripServiceSpy: jasmine.SpyObj<TripService>;
  let bookingServiceSpy: jasmine.SpyObj<BookingService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    tripServiceSpy = jasmine.createSpyObj('TripService', ['getTrips']);
    bookingServiceSpy = jasmine.createSpyObj('BookingService', ['getBookings']);
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['displayError', 'displaySuccess']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: TripService, useValue: tripServiceSpy },
        { provide: BookingService, useValue: bookingServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    tripServiceSpy.getTrips.and.returnValue(of(mockPagedTripResults));
    bookingServiceSpy.getBookings.and.returnValue(of(mockPagedBookingResults));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getTripsAndBookings', () => {


    it('should fetch trips and bookings and separate by status', () => {
      // Arrange
      component.getTripsAndBookings();

      // Assert
      expect(component.activeTrips().length).toBe(0);
      expect(component.plannedTrips().length).toBe(1);
      expect(component.completedTrips().length).toBe(2);
      expect(component.plannedTrips()[0].trip).toEqual(mockTrips[1]);
      expect(component.completedTrips()[0].trip).toEqual(mockTrips[0]);
    });

    it('should call alertService.displayError on error', () => {
      // Arrange
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Network error' },
        status: 500,
      });

      // Act
      tripServiceSpy.getTrips.and.returnValue(throwError(() => errorResponse));
      component.getTripsAndBookings();

      // Assert
      expect(alertServiceSpy.displayError).toHaveBeenCalledWith('Failed to fetch trips: Network error');
    });
  });

  describe('signals', () => {

    it('should compute total spent on trips correctly', () => {
      // Act
      const totalSpent = component.totalBudgetSpentOnTrips();

      // Assert
      expect(totalSpent).toBe(3500);
    });

    it('should compute total trips completed correctly', () => {
      // Act
      const totalCompleted = component.totalTripsCompleted();

      // Assert
      expect(totalCompleted).toBe(2);
    });

    it('should compute total destinations visited correctly', () => {
      // Act
      const totalDestinations = component.totalDestinationsVisited();

      // Assert
      expect(totalDestinations).toBe(2);
    });

    it('should return zero for total spent when there are no completed trips', () => {
      // Arrange
      const mockPageWithNoResults: PagedResultDto<TripDetailDto> = {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10
      };

      tripServiceSpy.getTrips.and.returnValue(of(mockPageWithNoResults));

      // Act
      component.getTripsAndBookings();
      const totalSpent = component.totalBudgetSpentOnTrips();

      // Assert
      expect(totalSpent).toBe(0);
    });
  });

  describe('onHeaderClick', () => {
    it('should navigate to /create-trip when "Plan New Trip" header tab is clicked', () => {
      // Arrange
      const actionLabel = 'Plan New Trip';

      // Act
      component.onHeaderActionClick(actionLabel);

      // Assert
      expect(router.navigate).toHaveBeenCalledWith(['/create-trip']);
    });

    it('should display alert message with correct message when "Saved Places" header tab is clicked', () => {
      // Arrange
      const actionLabel = 'Saved Places';

      // Act
      component.onHeaderActionClick(actionLabel);

      // Assert
      expect(alertServiceSpy.displaySuccess).toHaveBeenCalledWith('Saved Places feature coming soon!');
    });

    it('should display alert message with correct message when "Pro Features" header tab is clicked', () => {
      // Arrange
      const actionLabel = 'Pro Features';

      // Act
      component.onHeaderActionClick(actionLabel);

      // Assert
      expect(alertServiceSpy.displaySuccess).toHaveBeenCalledWith('Pro Features coming soon!');
    });

    it('should do nothing if onHeaderActionClick is called with an unknown action label', () => {
      // Arrange
      const actionLabel = 'Unknown Action';

      // Act
      component.onHeaderActionClick(actionLabel);

      // Assert
      expect(alertServiceSpy.displaySuccess).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('onQuickActionClick', () => {
    it('should navigate to /create-trip when "plan-trip" quick action is clicked', () => {
      // Arrange
      const action = 'plan-trip';
      
      // Act
      component.onQuickActionClick(action);

      // Assert
      expect(router.navigate).toHaveBeenCalledWith(['/create-trip']);
    });

    it('should display alert message when "add-booking" quick action is clicked', () => {
      // Arrange
      const action = 'add-booking';

      // Act
      component.onQuickActionClick(action);

      // Assert
      expect(alertServiceSpy.displaySuccess).toHaveBeenCalledWith('Add Booking feature coming soon!');
    });

    it('should display alert message when "generate-itinerary" quick action is clicked', () => {
      // Arrange
      const action = 'generate-itinerary';

      // Act
      component.onQuickActionClick(action);

      // Assert
      expect(alertServiceSpy.displaySuccess).toHaveBeenCalledWith('AI Itinerary generation coming soon!');
    });

    it('should display alert message when "check-flights" quick action is clicked', () => {
      // Arrange
      const action = 'check-flights';

      // Act
      component.onQuickActionClick(action);

      // Assert
      expect(alertServiceSpy.displaySuccess).toHaveBeenCalledWith('Check Flights feature coming soon!');
    });
  });
});
