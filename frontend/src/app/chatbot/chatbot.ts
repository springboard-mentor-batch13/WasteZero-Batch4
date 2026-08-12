import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ChatbotService,
  ChatMessage,
} from '../services/chatbot.service';

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

  readonly maxLength = 2000;

  constructor(private chatbotService: ChatbotService) {}

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
    this.isLoading = true;

    const conversation = [...this.messages];

    this.chatbotService.sendMessage(message, conversation).subscribe({
      next: (response) => {
        this.messages.push({
          role: 'assistant',
          content: response.reply,
        });

        this.isLoading = false;
      },

      error: () => {
        this.isLoading = false;

        this.errorMessage =
          'Sorry, something went wrong. Please try again.';

        this.messages.push({
          role: 'assistant',
          content:
            'I am unable to respond right now. Please try again later.',
        });
      },
    });
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