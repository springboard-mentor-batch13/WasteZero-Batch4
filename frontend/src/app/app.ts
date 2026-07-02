import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from './core/services/auth.service';
import { TokenService } from './core/services/token.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly auth = inject(AuthService);
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);

  protected readonly user = this.auth.user;
  protected readonly isLoggedIn = this.auth.isLoggedIn;

  constructor() {
    // Re-hydrate the session from a stored token on app load.
    if (this.tokenService.has()) {
      this.auth.loadCurrentUser().subscribe({ error: () => this.auth.logout() });
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
