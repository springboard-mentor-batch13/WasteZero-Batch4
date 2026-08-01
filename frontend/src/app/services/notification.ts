import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/notifications';

 getNotifications(): Observable<any> {
  return this.http.get(`${this.apiUrl}/`);  // no userId needed, backend reads from JWT
}

markAllRead(): Observable<any> {
  return this.http.patch(`${this.apiUrl}/read-all`, {});
}
}
