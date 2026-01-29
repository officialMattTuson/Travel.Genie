import { TestBed } from '@angular/core/testing';
import { TripPlanReviewService } from './trip-plan-review.service';
import { GeneratedTripPlanResponse } from '../../services/trip-planner.service';

describe('TripPlanReviewService', () => {
  let service: TripPlanReviewService;

  const mockTripPlan: GeneratedTripPlanResponse = {
    trip: {
      name: 'Paris Getaway',
      description: 'A romantic trip to Paris',
      startDate: '2025-06-01',
      endDate: '2025-06-07',
      destination: 'Paris, France',
    },
    attractions: [
      {
        name: 'Eiffel Tower',
        description: 'Iconic iron lattice tower',
        category: 'Landmark',
        estimatedCost: 25,
      },
    ],
    restaurants: [
      {
        name: 'Le Bernardin',
        cuisine: 'French',
        description: 'Fine dining seafood restaurant',
        specialty: 'Oysters',
        estimatedCost: 150,
      },
    ],
    budget: {
      total: 5000,
      accommodation: 1750,
      food: 1250,
      activities: 1250,
      transport: 500,
      other: 250,
    },
    aiNotes: ['Book Eiffel Tower tickets in advance', 'Try local pastries for breakfast'],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripPlanReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setTripPlan', () => {
    it('should set the trip plan', () => {
      service.setTripPlan(mockTripPlan);
      expect(service.getTripPlan()).toEqual(mockTripPlan);
    });

    it('should update the trip plan when called multiple times', () => {
      // Arrange
      const secondMockPlan: GeneratedTripPlanResponse = {
        ...mockTripPlan,
        trip: { ...mockTripPlan.trip, name: 'Tokyo Adventure' },
      };

      // Act & Assert
      service.setTripPlan(mockTripPlan);
      expect(service.getTripPlan()?.trip.name).toBe('Paris Getaway');

      service.setTripPlan(secondMockPlan);
      expect(service.getTripPlan()?.trip.name).toBe('Tokyo Adventure');
    });

    it('should emit the trip plan through the observable', (done) => {
      // Act & Assert
      service.generatedTripPlan$.subscribe((plan) => {
        if (plan) {
          expect(plan).toEqual(mockTripPlan);
          done();
        }
      });

      service.setTripPlan(mockTripPlan);
    });
  });

  describe('getTripPlan', () => {
    it('should return the set trip plan', () => {
      // Arrange
      service.setTripPlan(mockTripPlan);
      
      // Act
      const result = service.getTripPlan();
      
      // Assert
      expect(result).toEqual(mockTripPlan);
    });

    it('should return null when no trip plan is set', () => {
      const result = service.getTripPlan();
      expect(result).toBeNull();
    });

    it('should return the most recently set trip plan', () => {
      // Arrange
      const secondMockPlan = {
        ...mockTripPlan,
        trip: { ...mockTripPlan.trip, destination: 'Tokyo, Japan' },
      };

      // Act
      service.setTripPlan(mockTripPlan);
      service.setTripPlan(secondMockPlan);

      const result = service.getTripPlan();

      // Assert
      expect(result?.trip.destination).toBe('Tokyo, Japan');
    });
  });

  describe('generatedTripPlan$ observable', () => {
    it('should emit null initially', (done) => {
      // Act & Assert
      service.generatedTripPlan$.subscribe((plan) => {
        expect(plan).toBeNull();
        done();
      });
    });

    it('should emit the trip plan when setTripPlan is called', (done) => {
      // Act & Assert
      let emissionCount = 0;

      service.generatedTripPlan$.subscribe((plan) => {
        emissionCount++;
        if (emissionCount === 2) {
          expect(plan).toEqual(mockTripPlan);
          done();
        }
      });

      service.setTripPlan(mockTripPlan);
    });

    it('should emit multiple times when setTripPlan is called multiple times', (done) => {
      // Act & Assert
      const emittedValues: (GeneratedTripPlanResponse | null)[] = [];

      service.generatedTripPlan$.subscribe((plan) => {
        emittedValues.push(plan);
        if (emittedValues.length === 3) {
          expect(emittedValues[0]).toBeNull();
          expect(emittedValues[1]?.trip.name).toBe('Paris Getaway');
          expect(emittedValues[2]?.trip.name).toBe('Tokyo Adventure');
          done();
        }
      });

      const secondMockPlan = {
        ...mockTripPlan,
        trip: { ...mockTripPlan.trip, name: 'Tokyo Adventure' },
      };

      service.setTripPlan(mockTripPlan);
      service.setTripPlan(secondMockPlan);
    });
  });
});
