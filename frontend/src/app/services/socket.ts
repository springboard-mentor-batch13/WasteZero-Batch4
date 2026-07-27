import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:5000');
  }

  joinRoom(userId: string): void {
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

  disconnect(): void {
    this.socket.disconnect();
  }
}
