import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/communication';

  getContacts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/contacts`);
  }

  // getMessages(user1: string, user2: string): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/messages/${user1}/${user2}`);
  // }

   getMessages(otherUserId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/messages/${otherUserId}`);
  }
}
