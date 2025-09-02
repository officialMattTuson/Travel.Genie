import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegistrationDetails } from '../pages/authenticate/Models/registration-details.model';
import { Observable } from 'rxjs';

interface ApiMessage {
  message: string;
}

interface TokenResponse {
  token: string;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  public login(
    registrationDetails: RegistrationDetails
  ): Observable<TokenResponse> {
    return this.httpClient.post<TokenResponse>(
      '/api/auth/login',
      registrationDetails,
      { withCredentials: true }
    );
  }

  public logout(): Observable<ApiMessage> {
    return this.httpClient.post<ApiMessage>('/api/auth/logout', {});
  }

  public register(
    registrationDetails: RegistrationDetails
  ): Observable<TokenResponse> {
    console.log(registrationDetails);
    return this.httpClient.post<TokenResponse>(
      '/api/auth/register',
      registrationDetails
    );
  }

  public sendOtpRequest(email: string): Observable<ApiMessage> {
    return this.httpClient.post<ApiMessage>('/api/auth/request-otp', { email });
  }

  public verifyOtp(email: string, otp: string): Observable<ApiMessage> {
    return this.httpClient.post<ApiMessage>('/api/auth/verify-otp', {
      email,
      otp,
    });
  }

  public isAuthenticated(): Observable<boolean> {
    return this.httpClient.get<boolean>('/api/auth/is-authenticated');
  }
}
