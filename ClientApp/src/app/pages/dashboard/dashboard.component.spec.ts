import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { TripService } from '../../services/trip.service';
import { AlertService } from '../../services/alert.service';
import { of } from 'rxjs';
import { mockPagedTripResults, mockTrips } from '../../mocks/mock-trips';
import { Router } from '@angular/router';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let tripServiceSpy: jasmine.SpyObj<TripService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    tripServiceSpy = jasmine.createSpyObj('TripService', ['getTrips']);
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['displayError', 'displaySuccess']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: TripService, useValue: tripServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    tripServiceSpy.getTrips.and.returnValue(of(mockPagedTripResults));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('tripsResource', () => {
    it('should load trips and separate by status', async () => {
      // Arrange
      await fixture.whenStable();

      // Assert
      expect(component.tripsResource.isLoading()).toBe(false);
      expect(component.tripsResource.error()).toBeUndefined();
      expect(component.tripsResource.value()).toBeDefined();
      
      // Assert
      expect(component.activeTrips().length).toBe(0);
      expect(component.plannedTrips().length).toBe(1);
      expect(component.completedTrips().length).toBe(2);
      expect(component.plannedTrips()[0]).toEqual(mockTrips[1]);
      expect(component.completedTrips()[0]).toEqual(mockTrips[0]);
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
