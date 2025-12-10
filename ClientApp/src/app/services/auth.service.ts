import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegistrationDetails } from '../pages/authenticate/Models/registration-details.model';
import { Observable } from 'rxjs';
import { UserProfileDto } from '../models/dtos/user.dtos';

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
  private readonly apiUrl = '/api/auth';

  public login(
    registrationDetails: RegistrationDetails
  ): Observable<TokenResponse> {
    return this.httpClient.post<TokenResponse>(
      `${this.apiUrl}/login`,
      registrationDetails,
      { withCredentials: true }
    );
  }

  public logout(): Observable<ApiMessage> {
    return this.httpClient.post<ApiMessage>(`${this.apiUrl}/logout`, {});
  }

  public register(
    registrationDetails: RegistrationDetails
  ): Observable<TokenResponse> {
    console.log(registrationDetails);
    return this.httpClient.post<TokenResponse>(
      `${this.apiUrl}/register`,
      registrationDetails
    );
  }

  public sendOtpRequest(email: string): Observable<ApiMessage> {
    return this.httpClient.post<ApiMessage>(`${this.apiUrl}/request-otp`, { email });
  }

  public verifyOtp(email: string, otp: string): Observable<ApiMessage> {
    return this.httpClient.post<ApiMessage>(`${this.apiUrl}/verify-otp`, {
      email,
      otp,
    });
  }

  public isAuthenticated(): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.apiUrl}/is-authenticated`);
  }

  public getUserProfile(): Observable<UserProfileDto> {
    return this.httpClient.get<UserProfileDto>(`${this.apiUrl}/profile`);
  }

  public updateUserProfile(profile: Partial<UserProfileDto>): Observable<UserProfileDto> {
    return this.httpClient.put<UserProfileDto>(`${this.apiUrl}/profile`, profile);
  }
}
