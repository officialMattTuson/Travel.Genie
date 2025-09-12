import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { RegistrationDetails } from '../pages/authenticate/Models/registration-details.model';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login and return token response', () => {
    const registrationDetails: RegistrationDetails = {
      email: 'test@test.com',
      password: '123456',
    };
    const mockResponse = { token: 'abc123' };

    service.login(registrationDetails).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(registrationDetails);
    req.flush(mockResponse);
  });

  it('should call logout and return api message', () => {
    const mockResponse = { message: 'Logged out' };

    service.logout().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/auth/logout');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(mockResponse);
  });

  it('should call register and return token response', () => {
    const registrationDetails: RegistrationDetails = {
      email: 'new@test.com',
      password: 'abcdef',
    };
    const mockResponse = { token: 'def456' };

    service.register(registrationDetails).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(registrationDetails);
    req.flush(mockResponse);
  });

  it('should call sendOtpRequest and return api message', () => {
    const email = 'otp@test.com';
    const mockResponse = { message: 'OTP sent' };

    service.sendOtpRequest(email).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/auth/request-otp');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email });
    req.flush(mockResponse);
  });

  it('should call verifyOtp and return api message', () => {
    const email = 'verify@test.com';
    const otp = '123456';
    const mockResponse = { message: 'OTP verified' };

    service.verifyOtp(email, otp).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/auth/verify-otp');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email, otp });
    req.flush(mockResponse);
  });

  it('should call isAuthenticated and return boolean', () => {
    const mockResponse = true;

    service.isAuthenticated().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/auth/is-authenticated');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
