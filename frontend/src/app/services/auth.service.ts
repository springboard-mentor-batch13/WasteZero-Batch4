import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { API_BASE } from './api.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = API_BASE;
  private userSubject = new BehaviorSubject<any | null>(null);

  constructor(private http: HttpClient) {
    // Remove credentials left by versions that stored JWTs in Web Storage.
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.api}/auth/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.api}/auth/login`, data);
  }

  getProfile(): Observable<any> {
  return this.http.get(`${this.api}/users/profile`, {
    headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
  }).pipe(tap((user) => this.userSubject.next(user)));
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.api}/users/profile`, data)
      .pipe(tap((user) => this.userSubject.next(user)));
  }

  updateAvailability(isAvailable: boolean): Observable<any> {
    return this.http.patch(`${this.api}/users/availability`, { isAvailable });
  }

  saveAuth(res: any) {
    const { token, ...safeUser } = res || {};
    this.userSubject.next(safeUser?._id ? safeUser : null);
  }

  getUser(): any {
    return this.userSubject.value;
  }

  isLoggedIn(): boolean {
    return Boolean(this.userSubject.value);
  }

  ensureSession(): Observable<boolean> {
    if (this.isLoggedIn()) return of(true);
    return this.getProfile().pipe(
      map(() => true),
      catchError(() => {
        this.userSubject.next(null);
        return of(false);
      }),
    );
  }

  logout() {
    this.userSubject.next(null);
    this.http.post(`${this.api}/auth/logout`, {}).subscribe({ error: () => undefined });
  }
}
