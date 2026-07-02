import { Injectable } from '@angular/core';

const TOKEN_KEY = 'wastezero_token';

// Thin wrapper around localStorage for the JWT.
@Injectable({ providedIn: 'root' })
export class TokenService {
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  set(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  has(): boolean {
    return !!this.get();
  }
}
