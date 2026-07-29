import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';
import { RealtimeService } from '../services/realtime.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages implements OnInit, OnDestroy {
  contacts: any[] = [];
  messages: any[] = [];
  selectedContact: any;
  currentUser: any;
  draft = '';
  loading = true;
  error = '';
  private subscription?: Subscription;

  constructor(
    private messageService: MessageService,
    private realtime: RealtimeService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {
    this.currentUser = this.auth.getUser();
  }

  ngOnInit() {
    this.realtime.connect();
    this.loadContacts();
    this.subscription = this.realtime.messages$.subscribe((message) => {
      const senderId = message.sender_id?._id || message.sender_id;
      if (this.selectedContact?._id === senderId) this.messages.push(message);
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  loadContacts() {
    this.messageService.getContacts().subscribe({
      next: (contacts) => {
        this.contacts = contacts;
        this.loading = false;
        const requestedId = this.route.snapshot.queryParamMap.get('contact');
        const initial = contacts.find((contact) => contact._id === requestedId) || contacts[0];
        if (initial) this.selectContact(initial);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Could not load contacts';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  selectContact(contact: any) {
    this.selectedContact = contact;
    this.messages = [];
    this.messageService.getConversation(contact._id).subscribe({
      next: (result) => {
        this.messages = result.messages || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Could not load conversation';
        this.cdr.detectChanges();
      },
    });
  }

  send() {
    const content = this.draft.trim();
    if (!content || !this.selectedContact) return;
    this.draft = '';
    this.messageService.send(this.selectedContact._id, content).subscribe({
      next: (message) => {
        this.messages.push(message);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Message could not be sent';
        this.draft = content;
        this.cdr.detectChanges();
      },
    });
  }

  isMine(message: any) {
    return (message.sender_id?._id || message.sender_id) === this.currentUser?._id;
  }
}
