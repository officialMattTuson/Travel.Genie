import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripStatisticsComponent } from './trip-statistics.component';
import { mockTrips } from '../../../../mocks/mock-trips';
import { TripStatus } from '../../../../models/trip-type.model';
import { TripDetailsWithBookings } from '../../../../models/trip-details.model';

function getMockTrips(status: TripStatus): TripDetailsWithBookings[] {
  return mockTrips
    .filter(trip => trip.status === status)
    .map(trip => ({
      trip: trip,
      bookings: []
    }));
}
describe('TripStatisticsComponent', () => {
  let component: TripStatisticsComponent;
  let fixture: ComponentFixture<TripStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripStatisticsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TripStatisticsComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('activeTrips', getMockTrips(TripStatus.InProgress));
    fixture.componentRef.setInput('completedTrips', getMockTrips(TripStatus.Completed));
    fixture.componentRef.setInput('upcomingTrips', getMockTrips(TripStatus.Planned));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('signals', () => {

    it('should compute total spent on trips correctly', async () => {
      // Arrange
      await fixture.whenStable();

      // Act
      const totalSpent = component.totalBudgetSpentOnTrips();

      // Assert
      expect(totalSpent).toBe(3500);
    });

    it('should compute total destinations visited correctly', async () => {
      // Arrange
      await fixture.whenStable();

      // Act
      const totalDestinations = component.totalDestinationsVisited();

      // Assert
      expect(totalDestinations).toBe(2);
    });

    it('should return zero for total spent when there are no completed trips', async () => {
      // Arrange
      fixture.componentRef.setInput('completedTrips', []);

      // Act
      fixture.detectChanges();
      const totalSpent = component.totalBudgetSpentOnTrips();

      // Assert
      expect(totalSpent).toBe(0);
    });
  });
});
