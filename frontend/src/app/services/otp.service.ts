import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OtpService {
  private api = 'http://localhost:5000/api/otp';

  constructor(private http: HttpClient) {}

  sendOtp(): Observable<any> {
  return this.http.post(`${this.api}/send`, {}, {
    headers: { 'Cache-Control': 'no-cache' }
  });
}

verifyAndChange(data: {
  otp: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Observable<any> {
  return this.http.post(`${this.api}/verify-and-change`, data);
}

sendForgotPasswordOtp(email: string): Observable<any> {
  return this.http.post(`${this.api}/forgot-password/send`, { email });
}

sendRegisterOtp(email: string): Observable<any> {
  return this.http.post(`${this.api}/register/send`, { email });
}

resetForgotPassword(data: {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}): Observable<any> {
  return this.http.post(`${this.api}/forgot-password/reset`, data);
}
}
