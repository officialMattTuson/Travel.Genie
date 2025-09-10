import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { TripService } from '../../services/trip.service';
import { BookingService } from '../../services/booking.service';
import { AlertService } from '../../services/alert.service';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { mockTrips } from '../../mocks/mock-trips';
import { mockBookings } from '../../mocks/mock-bookings';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let tripServiceSpy: jasmine.SpyObj<TripService>;
  let bookingServiceSpy: jasmine.SpyObj<BookingService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    tripServiceSpy = jasmine.createSpyObj('TripService', ['getTrips']);
    bookingServiceSpy = jasmine.createSpyObj('BookingService', ['getBookings']);
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['displayError']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: TripService, useValue: tripServiceSpy },
        { provide: BookingService, useValue: bookingServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    tripServiceSpy.getTrips.and.returnValue(of(mockTrips));
    bookingServiceSpy.getBookings.and.returnValue(of(mockBookings));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch trips and bookings and set trips property', () => {
    component.getTripsAndBookings();

    expect(component.trips.length).toBe(2);
    expect(component.trips[0].trip).toEqual(mockTrips[0]);
    expect(component.trips[0].bookings.length).toBe(1);
    expect(component.trips[1].bookings.length).toBe(1);
  });

  it('should call alertService.displayError on error', () => {
    const errorResponse = new HttpErrorResponse({
      error: { message: 'Network error' },
      status: 500,
    });
    tripServiceSpy.getTrips.and.returnValue(throwError(() => errorResponse));

    component.getTripsAndBookings();

    expect(alertServiceSpy.displayError).toHaveBeenCalledWith('Failed to fetch trips: Network error');
  });
});
