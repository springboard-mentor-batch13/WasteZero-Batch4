import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import { AuthResponse, LoginPayload, RegisterPayload, Role, User } from '../models/user.model';

// Owns authentication state; exposes the current user as a signal.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  private readonly currentUser = signal<User | null>(null);

  readonly user = this.currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/register`, payload)
      .pipe(tap((res) => this.handleAuth(res)));
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, payload)
      .pipe(tap((res) => this.handleAuth(res)));
  }

  // Re-hydrate the current user from a stored token (on app start).
  loadCurrentUser(): Observable<{ success: boolean; user: User }> {
    return this.http
      .get<{ success: boolean; user: User }>(`${this.baseUrl}/me`)
      .pipe(tap((res) => this.currentUser.set(res.user)));
  }

  logout(): void {
    this.tokenService.clear();
    this.currentUser.set(null);
  }

  hasRole(...roles: Role[]): boolean {
    const role = this.currentUser()?.role;
    return !!role && roles.includes(role);
  }

  private handleAuth(res: AuthResponse): void {
    this.tokenService.set(res.token);
    this.currentUser.set(res.user);
  }
}
