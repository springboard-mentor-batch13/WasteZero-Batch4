import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API_BASE } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = `${API_BASE}/notifications`;

  // Shared across the app (Shell's Alerts badge + the Notifications page)
  // so both stay in sync without polling each other.
  private unreadCountSubject = new BehaviorSubject<number>(0);
  readonly unreadCount$ = this.unreadCountSubject.asObservable();

  getNotifications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`).pipe(
      tap((res: any) => {
        const unread = (res.data || []).filter((n: any) => !n.readAt).length;
        this.unreadCountSubject.next(unread);
      }),
    );
  }

  markAllRead(): Observable<any> {
    return this.http.patch(`${this.apiUrl}/read-all`, {}).pipe(
      tap(() => this.unreadCountSubject.next(0)),
    );
  }

  clearAll(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/`).pipe(
      tap(() => this.unreadCountSubject.next(0)),
    );
  }

  // Called from the Shell when a 'notification' socket event arrives, so
  // the Alerts badge updates live without needing a page visit/refresh.
  incrementUnread(): void {
    this.unreadCountSubject.next(this.unreadCountSubject.value + 1);
  }
}
