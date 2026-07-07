import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  user: any;
  sidebarOpen = false;

  constructor(
    public auth: AuthService,
    private router: Router,
  ) {
    this.user = this.auth.getUser();
  }

  get initial() {
    return (this.user?.name || '?').charAt(0).toUpperCase();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
