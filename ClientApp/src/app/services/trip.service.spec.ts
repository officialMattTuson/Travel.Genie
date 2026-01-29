import { TestBed } from '@angular/core/testing';
import { TripService } from './trip.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { mockTrips } from '../mocks/mock-trips';
import { TripDetailDto } from '../models/dtos/trip.dtos';
import { AiPlanRequestDto, AiPlanResponseDto } from '../models/dtos/ai.dtos';
import { ActivityInterest } from '../models/trip-type.model';

describe('TripService', () => {
  let service: TripService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TripService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTrips', () => {
    it('should return mock trips when useMockData is true', (done) => {
      service.getTrips().subscribe(result => {
        expect(result.items).toEqual(mockTrips);
        expect(result.pageNumber).toBe(1);
        expect(result.pageSize).toBe(10);
        expect(result.totalCount).toBe(mockTrips.length);
        done();
      });
    });

    it('should make HTTP request when useMockData is false', (done) => {
      service.useMockData = false;
      const mockResponse = { items: mockTrips, pageNumber: 1, pageSize: 10, totalCount: mockTrips.length };

      service.getTrips(1, 10).subscribe(result => {
        expect(result).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne('/api/trips?pageNumber=1&pageSize=10');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fallback to mock data on HTTP error', (done) => {
      service.useMockData = false;
      spyOn(console, 'warn');

      service.getTrips().subscribe(result => {
        expect(result.items).toEqual(mockTrips);
        expect(console.warn).toHaveBeenCalled();
        done();
      });

      const req = httpMock.expectOne('/api/trips?pageNumber=1&pageSize=10');
      req.error(new ProgressEvent('error'));
    });
  });

  describe('getTripDetail', () => {
    it('should return trip from mock data when found', (done) => {
      const tripId = mockTrips[0].id;
      service.getTripDetail(tripId).subscribe(result => {
        expect(result).toEqual(mockTrips[0]);
        done();
      });
    });

    it('should return first mock trip when trip not found in mock data', (done) => {
      service.getTripDetail('non-existent-id').subscribe(result => {
        expect(result).toEqual(mockTrips[0]);
        done();
      });
    });

    it('should make HTTP request when useMockData is false', (done) => {
      service.useMockData = false;
      const tripId = 'test-id';

      service.getTripDetail(tripId).subscribe(result => {
        expect(result).toEqual(mockTrips[0]);
        done();
      });

      const req = httpMock.expectOne(`/api/trips/${tripId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTrips[0]);
    });
  });

  describe('createTrip', () => {
    it('should create trip with generated id in mock mode', (done) => {
      const newTrip: Partial<TripDetailDto> = { name: 'Test Trip' };

      service.createTrip(newTrip).subscribe(result => {
        expect(result.name).toBe('Test Trip');
        expect(result.id).toBeDefined();
        done();
      });
    });

    it('should make POST request when useMockData is false', (done) => {
      service.useMockData = false;
      const newTrip: Partial<TripDetailDto> = { name: 'Test Trip' };

      service.createTrip(newTrip).subscribe(result => {
        expect(result).toEqual(mockTrips[0]);
        done();
      });

      const req = httpMock.expectOne('/api/trips');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newTrip);
      req.flush(mockTrips[0]);
    });
  });

  describe('updateTrip', () => {
    it('should update trip in mock mode', (done) => {
      const tripId = 'test-id';
      const updates: Partial<TripDetailDto> = { name: 'Updated Trip' };

      service.updateTrip(tripId, updates).subscribe(result => {
        expect(result.id).toBe(tripId);
        expect(result.name).toBe('Updated Trip');
        done();
      });
    });

    it('should make PUT request when useMockData is false', (done) => {
      service.useMockData = false;
      const tripId = 'test-id';
      const updates: Partial<TripDetailDto> = { name: 'Updated Trip' };

      service.updateTrip(tripId, updates).subscribe(result => {
        expect(result).toEqual(mockTrips[0]);
        done();
      });

      const req = httpMock.expectOne(`/api/trips/${tripId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updates);
      req.flush(mockTrips[0]);
    });
  });

  describe('deleteTrip', () => {
    it('should delete trip in mock mode', (done) => {
      service.deleteTrip('test-id').subscribe(result => {
        expect(result).toBeUndefined();
        done();
      });
    });

    it('should make DELETE request when useMockData is false', (done) => {
      service.useMockData = false;
      const tripId = 'test-id';

      service.deleteTrip(tripId).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`/api/trips/${tripId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('generateAiPlan', () => {
    it('should return mock AI plan response', (done) => {
      const request: AiPlanRequestDto =
      {
        tripName: 'Paris Vacation',
        primaryDestination: {
          id: 'dest-1',
          name: 'Paris',
          countryCode: 'FR',
        },
        additionalDestinations: [{
          id: 'dest-1',
          name: 'Paris',
          countryCode: 'FR',
        }],
        interests: [ActivityInterest.Beach, ActivityInterest.Food],
      };

      service.generateAiPlan(request).subscribe(result => {
        expect(result.proposalId).toBeDefined();
        expect(result.suggestedTripName).toBe('Paris Vacation');
        expect(result.suggestedBudget?.currencyCode).toBe('USD');
        expect(result.insights.length).toBeGreaterThan(0);
        done();
      });
    });

    it('should use default trip name when not provided', (done) => {
      const request: AiPlanRequestDto = {} as AiPlanRequestDto;

      service.generateAiPlan(request).subscribe(result => {
        expect(result.suggestedTripName).toBe('AI Generated Trip');
        done();
      });
    });

    it('should make POST request when useMockData is false', (done) => {
      service.useMockData = false;
      const request: AiPlanRequestDto =
      {
        tripName: 'Paris Vacation',
        primaryDestination: {
          id: 'dest-1',
          name: 'Paris',
          countryCode: 'FR',
        },
        additionalDestinations: [{
          id: 'dest-1',
          name: 'Paris',
          countryCode: 'FR',
        }],
        interests: [ActivityInterest.Beach, ActivityInterest.Food],
      };
      const mockResponse: AiPlanResponseDto = 
      { 
        proposalId: '123', 
        suggestedTripName: 'Test Trip',
        suggestedDays: [],
        insights: [] 
      };

      service.generateAiPlan(request).subscribe(result => {
        expect(result).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne('/api/trips/ai/plan');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });
  });
});
