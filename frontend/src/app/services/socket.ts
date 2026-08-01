import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:5000', {
      autoConnect: false,
      auth: { token: localStorage.getItem('token') },
    });
  }

  joinRoom(userId: string): void {
    this.socket.auth = { token: localStorage.getItem('token') };
    if (!this.socket.connected) this.socket.connect();
    this.socket.emit('join_room', userId);
  }

  sendMessage(message: any): void {
    this.socket.emit('send_message', message);
  }

  receiveMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('receive_message', (message) => {
        observer.next(message);
      });

      return () => {
        this.socket.off('receive_message');
      };
    });
  }

  markMessagesRead(senderId: string): void {
    this.socket.emit('mark_messages_read', { senderId });
  }

  messagesRead(): Observable<{ messageIds: string[]; readAt: string }> {
    return new Observable(observer => {
      const handler = (update: { messageIds: string[]; readAt: string }) => observer.next(update);
      this.socket.on('messages_read', handler);
      return () => this.socket.off('messages_read', handler);
    });
  }

  messageError(): Observable<{ message: string }> {
    return new Observable(observer => {
      const handler = (error: { message: string }) => observer.next(error);
      this.socket.on('message_error', handler);
      return () => this.socket.off('message_error', handler);
    });
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
