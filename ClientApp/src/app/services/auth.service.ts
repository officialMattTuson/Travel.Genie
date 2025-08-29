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
  providedIn: 'root'
})
export class AuthService {

  private readonly httpClient = inject(HttpClient);


  login(registrationDetails: RegistrationDetails): Observable<TokenResponse> {
    return this.httpClient.post<TokenResponse>('/api/auth/login', registrationDetails);
  }


  logout(): Observable<ApiMessage> {
    return this.httpClient.post<ApiMessage>('/api/auth/logout', {});
  }


  register(registrationDetails: RegistrationDetails): Observable<TokenResponse> {
    return this.httpClient.post<TokenResponse>('/api/auth/register', registrationDetails);
  }


  sendOtpRequest(email: string): Observable<ApiMessage> {
    return this.httpClient.post<ApiMessage>('/api/auth/request-otp', { email });
  }


  verifyOtp(email: string, otp: string): Observable<ApiMessage> {
    return this.httpClient.post<ApiMessage>('/api/auth/verify-otp', { email, otp });
  }

}
