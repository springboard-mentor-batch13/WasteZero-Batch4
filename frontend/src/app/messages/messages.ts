import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, Subscription, timeout } from 'rxjs';
import { MessageService } from '../services/message';
import { SocketService } from '../services/socket';
import { AuthService } from '../services/auth.service';

interface ChatContact {
  _id: string;
  name: string;
  email: string;
  role: string;
  lastMessage: string;
  lastMessageAt: string | null;
}

interface ChatMessage {
  _id?: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages implements OnInit, OnDestroy {
  contacts: ChatContact[] = [];
  messages: ChatMessage[] = [];
  activeContact: ChatContact | null = null;
  currentUser: any;
  searchQuery = '';
  newMessage = '';
  loadingContacts = true;
  loadingMessages = false;
  error = '';

  private messageSubscription?: Subscription;

  constructor(
    private messageService: MessageService,
    private socketService: SocketService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    if (!this.currentUser) return;

    this.socketService.joinRoom(this.currentUser._id);
    this.loadContacts();

    this.messageSubscription = this.socketService.receiveMessage().subscribe((message: ChatMessage) => {
      const partnerId = message.sender_id === this.currentUser._id
        ? message.receiver_id
        : message.sender_id;

      if (this.activeContact?._id === partnerId) {
        this.messages = [...this.messages, message];
      }

      this.updateContactPreview(partnerId, message);
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
  }

  get filteredContacts(): ChatContact[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) return this.contacts;

    return this.contacts.filter((contact) =>
      [contact.name, contact.email, contact.role, contact.lastMessage]
        .some((value) => value?.toLowerCase().includes(query)),
    );
  }

  get activeInitial(): string {
    return this.activeContact?.name?.charAt(0).toUpperCase() || '?';
  }

  get currentUserId(): string {
    return this.currentUser?._id || '';
  }

  contactInitial(contact: ChatContact): string {
    return contact.name?.charAt(0).toUpperCase() || '?';
  }

  selectContact(contact: ChatContact): void {
    this.activeContact = contact;
    this.loadMessages();
  }

  loadContacts(): void {
    this.loadingContacts = true;
    this.error = '';

    this.messageService.getContacts()
      .pipe(
        timeout(15_000),
        finalize(() => {
          this.loadingContacts = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
      next: (res: any) => {
        this.contacts = res.data || [];

        if (!this.activeContact && this.contacts.length) {
          this.selectContact(this.contacts[0]);
        }
      },
      error: (err) => {
        this.error = err.name === 'TimeoutError'
          ? 'The conversations request timed out. Please try again.'
          : err.error?.message || 'Could not load conversations.';
      },
    });
  }

  loadMessages(): void {
    if (!this.activeContact || !this.currentUserId) return;

    this.loadingMessages = true;
    this.error = '';

    this.messageService
      .getMessages(this.currentUserId, this.activeContact._id)
      .pipe(
        timeout(15_000),
        finalize(() => {
          this.loadingMessages = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.messages = res.data || [];
        },
        error: (err) => {
          this.error = err.name === 'TimeoutError'
            ? 'The messages request timed out. Please try again.'
            : err.error?.message || 'Could not load messages.';
        },
      });
  }

  sendMessage(): void {
    const content = this.newMessage.trim();
    if (!content || !this.activeContact || !this.currentUserId) return;

    this.socketService.sendMessage({
      sender_id: this.currentUserId,
      receiver_id: this.activeContact._id,
      content,
    });

    this.newMessage = '';
  }

  private updateContactPreview(partnerId: string, message: ChatMessage): void {
    const index = this.contacts.findIndex((contact) => contact._id === partnerId);
    if (index < 0) {
      this.loadContacts();
      return;
    }

    const updated = {
      ...this.contacts[index],
      lastMessage: message.content,
      lastMessageAt: message.timestamp,
    };

    this.contacts = [updated, ...this.contacts.filter((_, contactIndex) => contactIndex !== index)];
    if (this.activeContact?._id === updated._id) {
      this.activeContact = updated;
    }
  }
}
