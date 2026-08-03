import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { API_ORIGIN } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private currentUserId: string | null = null;

  constructor() {
    this.socket = io(API_ORIGIN, {
      autoConnect: false,
      withCredentials: true,
    });

    // The server auto-joins the room on every 'connect', but every
    // reconnect (dropped wifi, backend restart, tab woken from sleep) gets a
    // brand-new socket id and loses room membership until it rejoins. This
    // used to mean messages only showed up after a manual page refresh.
    // Re-emitting join_room here (belt-and-suspenders alongside the
    // server-side auto-join) guarantees the room is always current, and lets
    // us tell the rest of the app "we just reconnected, re-sync".
    this.socket.on('connect', () => {
      if (this.currentUserId) {
        this.socket.emit('join_room', this.currentUserId);
      }
    });
  }

  joinRoom(userId: string): void {
    this.currentUserId = userId;
    if (!this.socket.connected) this.socket.connect();
    this.socket.emit('join_room', userId);
  }

  sendMessage(message: any): void {
    this.socket.emit('send_message', message);
  }

  receiveMessage(): Observable<any> {
    return new Observable(observer => {
      const handler = (message: any) => observer.next(message);
      this.socket.on('receive_message', handler);
      return () => this.socket.off('receive_message', handler);
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

  // Fires when previously-'sent' messages reach an online recipient
  // (single grey tick -> double grey tick).
  messageDelivered(): Observable<{ messageIds: string[] }> {
    return new Observable(observer => {
      const handler = (update: { messageIds: string[] }) => observer.next(update);
      this.socket.on('message_delivered', handler);
      return () => this.socket.off('message_delivered', handler);
    });
  }

  // Live online/offline changes for a single contact.
  userStatus(): Observable<{ userId: string; status: 'online' | 'offline'; lastSeen?: string }> {
    return new Observable(observer => {
      const handler = (update: { userId: string; status: 'online' | 'offline'; lastSeen?: string }) =>
        observer.next(update);
      this.socket.on('user_status', handler);
      return () => this.socket.off('user_status', handler);
    });
  }

  // Snapshot of who is online right now, sent once right after connecting.
  onlineUsersSnapshot(): Observable<{ userIds: string[] }> {
    return new Observable(observer => {
      const handler = (update: { userIds: string[] }) => observer.next(update);
      this.socket.on('online_users', handler);
      return () => this.socket.off('online_users', handler);
    });
  }

  // Fires every time the socket (re)connects, so the app can re-sync the
  // active conversation and cover any gap from time spent disconnected.
  connected(): Observable<void> {
    return new Observable(observer => {
      const handler = () => observer.next();
      this.socket.on('connect', handler);
      return () => this.socket.off('connect', handler);
    });
  }

  messageError(): Observable<{ message: string }> {
    return new Observable(observer => {
      const handler = (error: { message: string }) => observer.next(error);
      this.socket.on('message_error', handler);
      return () => this.socket.off('message_error', handler);
    });
  }

  // Live push for in-app notifications (new message while offline, pickup
  // assigned/status changed, etc.) - see backend/utils/notify.js.
  notification(): Observable<any> {
    return new Observable(observer => {
      const handler = (notification: any) => observer.next(notification);
      this.socket.on('notification', handler);
      return () => this.socket.off('notification', handler);
    });
  }

  disconnect(): void {
    this.currentUserId = null;
    this.socket.disconnect();
  }
}
