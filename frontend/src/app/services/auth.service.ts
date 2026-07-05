import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.api}/auth/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.api}/auth/login`, data);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.api}/users/profile`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.api}/users/profile`, data);
  }

  saveAuth(res: any) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
