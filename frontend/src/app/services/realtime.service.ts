import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private socket?: Socket;
  private messagesSubject = new Subject<any>();
  private notificationsSubject = new Subject<void>();

  readonly messages$: Observable<any> = this.messagesSubject.asObservable();
  readonly notifications$: Observable<void> = this.notificationsSubject.asObservable();

  constructor(private auth: AuthService) {}

  connect() {
    const token = this.auth.getToken();
    if (!token || this.socket?.connected) return;

    this.socket = io('http://localhost:5000', { auth: { token } });
    this.socket.on('message:new', (message) => this.messagesSubject.next(message));
    this.socket.on('notification:new', () => this.notificationsSubject.next());
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = undefined;
  }
}
