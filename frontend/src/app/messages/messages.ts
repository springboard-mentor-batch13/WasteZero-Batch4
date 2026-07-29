import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../services/message';
import { SocketService } from '../services/socket';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages implements OnInit {
  messages: any[] = [];
  newMessage = '';

  currentUser: any;
  receiverId = '';

  constructor(
    private messageService: MessageService,
    private socketService: SocketService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();

    if (!this.currentUser) return;

    this.socketService.joinRoom(this.currentUser._id);

    // Temporary receiver until conversation selection is added
    this.receiverId = '';

    this.socketService.receiveMessage().subscribe((message) => {
      this.messages.push(message);
    });
  }

  loadMessages() {
    if (!this.receiverId) return;

    this.messageService
      .getMessages(this.currentUser._id, this.receiverId)
      .subscribe({
        next: (res: any) => {
          this.messages = res.data;
        },
        error: (err) => console.error(err),
      });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.receiverId) return;

    const payload = {
      sender_id: this.currentUser._id,
      receiver_id: this.receiverId,
      content: this.newMessage,
    };

    this.socketService.sendMessage(payload);

    this.newMessage = '';
  }
}
