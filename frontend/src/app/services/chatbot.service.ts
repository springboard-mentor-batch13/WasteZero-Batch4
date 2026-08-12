import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  reply: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private readonly apiUrl = '/api/chatbot';

  constructor(private http: HttpClient) {}

  sendMessage(
    message: string,
    conversation: ChatMessage[]
  ): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.apiUrl, {
      message,
      conversation,
    });
  }
}