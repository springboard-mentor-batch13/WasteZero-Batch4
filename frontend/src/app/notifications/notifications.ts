import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from '../services/notification';
import { AuthService } from '../services/auth.service';
import { SocketService } from '../services/socket';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications implements OnInit, OnDestroy {
  notifications: any[] = [];
  currentUser: any;
  private notificationSub?: Subscription;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private socketService: SocketService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    if (!this.currentUser) return;

    this.notificationService.getNotifications().subscribe({
      next: (res: any) => {
        this.notifications = res.data || [];
        this.cdr.detectChanges();
        if (this.notifications.some((n) => !n.readAt)) {
          this.notificationService.markAllRead().subscribe();
        }
      },
      error: (err) => console.error(err),
    });

    this.notificationSub = this.socketService.notification().subscribe((notification) => {
      this.notifications = [notification, ...this.notifications];
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.notificationSub?.unsubscribe();
  }

  open(notification: any): void {
    if (!notification.link) return;
    const [path, queryString] = notification.link.split('?');
    if (!queryString) {
      this.router.navigateByUrl(notification.link);
      return;
    }
    const queryParams: Record<string, string> = {};
    new URLSearchParams(queryString).forEach((value, key) => {
      queryParams[key] = value;
    });
    this.router.navigate([path], { queryParams });
  }
}