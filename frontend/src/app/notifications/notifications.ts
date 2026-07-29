import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { RealtimeService } from '../services/realtime.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications implements OnInit, OnDestroy {
  notifications: any[] = [];
  unread = 0;
  loading = true;
  private subscription?: Subscription;

  constructor(
    private notificationService: NotificationService,
    private realtime: RealtimeService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.realtime.connect();
    this.load();
    this.subscription = this.realtime.notifications$.subscribe(() => this.load());
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  load() {
    this.notificationService.getAll().subscribe({
      next: (result) => {
        this.notifications = result.notifications;
        this.unread = result.unread;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  open(notification: any) {
    const navigate = () => notification.link && this.router.navigateByUrl(notification.link);
    if (notification.read_at) return navigate();
    this.notificationService.markRead(notification._id).subscribe({
      next: navigate,
      error: navigate,
    });
  }

  markAllRead() {
    this.notificationService.markAllRead().subscribe(() => this.load());
  }
}
