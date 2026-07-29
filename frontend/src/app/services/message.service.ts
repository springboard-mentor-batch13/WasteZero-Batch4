import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private api = 'http://localhost:5000/api/messages';

  constructor(private http: HttpClient) {}

  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/contacts`);
  }

  getConversation(userId: string): Observable<any> {
    return this.http.get<any>(`${this.api}/${userId}`);
  }

  send(userId: string, content: string): Observable<any> {
    return this.http.post<any>(`${this.api}/${userId}`, { content });
  }
}
