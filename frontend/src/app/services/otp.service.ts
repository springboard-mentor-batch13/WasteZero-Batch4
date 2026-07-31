import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OtpService {
  private api = 'http://localhost:5000/api/otp';

  constructor(private http: HttpClient) {}

  sendOtp(): Observable<any> {
    return this.http.post(
      `${this.api}/send`,
      {},
      { headers: { 'Cache-Control': 'no-cache', 'Content-Type': 'application/json' } }
    );
  }

  verifyAndChange(data: {
    otp: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Observable<any> {
    return this.http.post(`${this.api}/verify-and-change`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  sendForgotPasswordOtp(email: string): Observable<any> {
    return this.http.post(
      `${this.api}/forgot-password/send`,
      { email },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  sendRegisterOtp(email: string): Observable<any> {
    return this.http.post(
      `${this.api}/register/send`,
      { email },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  resetForgotPassword(data: {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
  }): Observable<any> {
    return this.http.post(`${this.api}/forgot-password/reset`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
