import { TestBed } from '@angular/core/testing';

import { TripPlanReviewService } from './trip-plan-review.service';

describe('TripPlanReviewService', () => {
  let service: TripPlanReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripPlanReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
