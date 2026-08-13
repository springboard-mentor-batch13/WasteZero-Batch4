import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class ChatbotComponent {
  isOpen = false;
  isLoading = false;
  inputMessage = '';
  errorMessage = '';

  messages: ChatMessage[] = [];

  readonly maxLength = 500;

  private localReply(message: string): string | null {
    const text = message.toLowerCase();
    if (/^(hi|hello|hey|help)[!. ]*$/.test(text)) return 'Hello! I can help you use WasteZero. Ask me about pickups, opportunities, applications, messages, notifications, profiles, or support.';
    if (/pickup|schedule/.test(text)) return 'Open Schedule Pickup from the sidebar. Enter the pickup details and waste types, then submit the request. You can track its status on the same page.';
    if (/opportunit/.test(text)) return 'Open Opportunities to browse or manage opportunities. Volunteers can view details and apply; NGOs and Admins can create and manage listings.';
    if (/application/.test(text)) return 'Open Applications to view pending, accepted, or rejected applications. NGOs and Admins can review pending applications.';
    if (/message|chat/.test(text)) return 'Open Messages and select a contact. Volunteer and NGO messaging becomes available after an application is accepted.';
    if (/notification|alert/.test(text)) return 'Select Alerts in the top bar to view your notifications and unread updates.';
    if (/password|otp|profile/.test(text)) return 'Open My Profile to update your details or request an OTP for changing your password.';
    if (/admin|report|manage user/.test(text)) return 'Admins can open Admin Panel to manage users and review platform activity.';
    if (/support/.test(text)) return 'Open Help & Support from the sidebar to report an issue related to a pickup or application.';
    return null;
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    this.errorMessage = '';
  }

  closeChat(): void {
    this.isOpen = false;
    this.errorMessage = '';
  }

  sendMessage(): void {
    const message = this.inputMessage.trim();

    if (!message || this.isLoading) {
      return;
    }

    if (message.length > this.maxLength) {
      this.errorMessage = `Message cannot exceed ${this.maxLength} characters.`;
      return;
    }

    this.errorMessage = '';

    this.messages.push({
      role: 'user',
      content: message,
    });

    this.inputMessage = '';

    const reply = this.localReply(message);
    if (reply) {
      this.messages.push({ role: 'assistant', content: reply });
      return;
    }

    this.messages.push({
      role: 'assistant',
      content: 'I can only help with WasteZero website features such as pickups, opportunities, applications, messages, notifications, profiles, and support.',
    });
    return;

  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearConversation(): void {
    if (this.isLoading) {
      return;
    }

    this.messages = [];
    this.inputMessage = '';
    this.errorMessage = '';
  }

  trackByMessage(index: number): number {
    return index;
  }
}
