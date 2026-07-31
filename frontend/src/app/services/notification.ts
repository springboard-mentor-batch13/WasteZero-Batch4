import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/communication';

  getNotifications(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/notifications/${userId}`);
  }
}
