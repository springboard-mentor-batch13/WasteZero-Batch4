import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { AppTheme, ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  user: any;
  sidebarOpen = false;
  searchQuery = '';
  theme: AppTheme = 'light';

  constructor(
    public auth: AuthService,
    private router: Router,
    private themeService: ThemeService,
  ) {
    this.user = this.auth.getUser();
    this.theme = this.themeService.theme;
  }

  get initial() {
    return (this.user?.name || '?').charAt(0).toUpperCase();
  }

  get roleLabel(): string {
    const role = this.user?.role || '';
    if (role === 'admin') return 'Admin';
    if (role === 'ngo') return 'NGO';
    return 'Volunteer';
  }

  onNavSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/opportunities'], {
        queryParams: { search: this.searchQuery.trim() }
      });
      this.searchQuery = '';
    }
  }

  toggleTheme() {
    this.theme = this.themeService.toggle();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
