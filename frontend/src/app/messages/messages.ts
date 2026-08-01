import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  status?: 'sent' | 'delivered' | 'read';
  context?: {
    kind: 'pickup' | 'opportunity' | 'general';
    refId?: string | null;
    label?: string;
  };
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
  onlineContactIds = new Set<string>();

  private messageSubscription?: Subscription;
  private readSubscription?: Subscription;
  private deliveredSubscription?: Subscription;
  private statusSubscription?: Subscription;
  private onlineSnapshotSubscription?: Subscription;
  private reconnectSubscription?: Subscription;
  private errorSubscription?: Subscription;
  private isFirstConnect = true;

  constructor(
    private messageService: MessageService,
    private socketService: SocketService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    if (!this.currentUser) return;

    const pendingContactId = this.route.snapshot.queryParamMap.get('contactId');

    this.socketService.joinRoom(this.currentUser._id);
    this.loadContacts(pendingContactId);

    this.messageSubscription = this.socketService.receiveMessage().subscribe((message: ChatMessage) => {
      const partnerId = message.sender_id === this.currentUser._id
        ? message.receiver_id
        : message.sender_id;

      if (this.activeContact?._id === partnerId) {
        this.messages = [...this.messages, message];
        if (message.receiver_id === this.currentUserId) {
          this.socketService.markMessagesRead(message.sender_id);
        }
      }

      this.updateContactPreview(partnerId, message);
      this.cdr.detectChanges();
    });

    this.readSubscription = this.socketService.messagesRead().subscribe(({ messageIds }) => {
      const readIds = new Set(messageIds);
      this.messages = this.messages.map((message) =>
        message._id && readIds.has(message._id) ? { ...message, status: 'read' } : message,
      );
      this.cdr.detectChanges();
    });

    this.deliveredSubscription = this.socketService.messageDelivered().subscribe(({ messageIds }) => {
      const deliveredIds = new Set(messageIds);
      this.messages = this.messages.map((message) =>
        message._id && deliveredIds.has(message._id) && message.status !== 'read'
          ? { ...message, status: 'delivered' }
          : message,
      );
      this.cdr.detectChanges();
    });

    // Online/offline presence, like WhatsApp's "Available" / last seen.
    this.onlineSnapshotSubscription = this.socketService.onlineUsersSnapshot().subscribe(({ userIds }) => {
      this.onlineContactIds = new Set(userIds);
      this.cdr.detectChanges();
    });

    this.statusSubscription = this.socketService.userStatus().subscribe(({ userId, status }) => {
      if (status === 'online') {
        this.onlineContactIds.add(userId);
      } else {
        this.onlineContactIds.delete(userId);
      }
      this.cdr.detectChanges();
    });

    this.reconnectSubscription = this.socketService.connected().subscribe(() => {
      if (this.isFirstConnect) {
        this.isFirstConnect = false;
        return;
      }
      if (this.activeContact) {
        this.loadMessages();
      }
      this.loadContacts();
    });

    this.errorSubscription = this.socketService.messageError().subscribe(({ message }) => {
      this.error = message;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
    this.readSubscription?.unsubscribe();
    this.deliveredSubscription?.unsubscribe();
    this.statusSubscription?.unsubscribe();
    this.onlineSnapshotSubscription?.unsubscribe();
    this.reconnectSubscription?.unsubscribe();
    this.errorSubscription?.unsubscribe();
  }

  isContactOnline(contactId: string | undefined | null): boolean {
    return !!contactId && this.onlineContactIds.has(contactId);
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

  loadContacts(pendingContactId: string | null = null): void {
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

        if (pendingContactId) {
          const target = this.contacts.find((contact) => contact._id === pendingContactId);
          if (target) {
            this.selectContact(target);
            return;
          }
          setTimeout(() => this.loadContacts(pendingContactId), 800);
          return;
        }

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
       .getMessages(this.activeContact._id)
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
          this.socketService.markMessagesRead(this.activeContact!._id);
        },
        error: (err) => {
          this.error = err.name === 'TimeoutError'
            ? 'The messages request timed out. Please try again.'
            : err.error?.message || 'Could not load messages.';
        },
      });
  }

  messageStatusLabel(message: ChatMessage): string {
    if (message.status === 'read') return 'Read';
    if (message.status === 'delivered') return 'Delivered';
    return 'Sent';
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