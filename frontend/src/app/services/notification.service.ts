import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private api = 'http://localhost:5000/api/notifications';

  constructor(private http: HttpClient) {}

  getAll(): Observable<{ notifications: any[]; unread: number }> {
    return this.http.get<{ notifications: any[]; unread: number }>(this.api);
  }

  markRead(id: string): Observable<any> {
    return this.http.patch(`${this.api}/${id}/read`, {});
  }

  markAllRead(): Observable<any> {
    return this.http.patch(`${this.api}/read-all`, {});
  }
}
