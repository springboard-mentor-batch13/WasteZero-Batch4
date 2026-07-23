import { Injectable } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  messages: ToastMessage[] = [];
  private nextId = 1;

  show(message: string, type: ToastType = 'info'): void {
    const toast = { id: this.nextId++, message, type };
    this.messages = [...this.messages, toast];

    setTimeout(() => this.dismiss(toast.id), 3500);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  dismiss(id: number): void {
    this.messages = this.messages.filter((toast) => toast.id !== id);
  }
}
