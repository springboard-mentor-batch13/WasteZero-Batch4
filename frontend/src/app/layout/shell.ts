import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AppTheme, ThemeService } from '../services/theme.service';
import { SocketService } from '../services/socket';
import { NotificationService } from '../services/notification';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell implements OnInit, OnDestroy {
  user: any;
  sidebarOpen = false;
  searchQuery = '';
  theme: AppTheme = 'light';
  unreadCount = 0;

  private notificationSub?: Subscription;
  private unreadCountSub?: Subscription;

  constructor(
    public auth: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private socketService: SocketService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
  ) {
    this.user = this.auth.getUser();
    this.theme = this.themeService.theme;
  }

  ngOnInit(): void {
    if (!this.user) return;

    // Connect once here, at the top-level layout every authenticated page
    // sits inside, so notifications (and chat delivery) work no matter
    // which page the person is on - not just while Messages is open.
    this.socketService.joinRoom(this.user._id);

    this.notificationService.getNotifications().subscribe();

    this.unreadCountSub = this.notificationService.unreadCount$.subscribe((count) => {
      this.unreadCount = count;
      this.cdr.detectChanges();
    });

    this.notificationSub = this.socketService.notification().subscribe(() => {
      this.notificationService.incrementUnread();
    });
  }

  ngOnDestroy(): void {
    this.notificationSub?.unsubscribe();
    this.unreadCountSub?.unsubscribe();
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