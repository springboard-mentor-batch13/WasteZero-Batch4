import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private http = inject(HttpClient);
  private apiUrl = `${API_BASE}/communication`;

  getContacts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/contacts`);
  }

   getMessages(otherUserId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/messages/${otherUserId}`);
  }

  getSupportContact(): Observable<any> {
    return this.http.get(`${this.apiUrl}/support-contact`);
  }
}
