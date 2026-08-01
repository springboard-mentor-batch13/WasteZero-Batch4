import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { MessageService } from '../services/message';
import { SocketService } from '../services/socket';
import { AuthService } from '../services/auth.service';
import { PickupService } from '../services/pickup.service';
import { OpportunityService } from '../opportunities/opportunity.service';

type ConcernCategory = 'pickup' | 'opportunity' | null;

interface ConcernItem {
  id: string;
  label: string;
  sublabel: string;
}

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support.html',
  styleUrl: './support.css',
})
export class Support implements OnInit {
  step: 1 | 2 | 3 = 1;
  category: ConcernCategory = null;

  items: ConcernItem[] = [];
  loadingItems = false;
  selectedItem: ConcernItem | null = null;

  concern = '';
  submitting = false;
  error = '';
  currentUser: any;

  constructor(
    private messageService: MessageService,
    private socketService: SocketService,
    private authService: AuthService,
    private pickupService: PickupService,
    private opportunityService: OpportunityService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
  }

  chooseCategory(category: Exclude<ConcernCategory, null>): void {
    this.category = category;
    this.selectedItem = null;
    this.error = '';
    this.step = 2;
    this.loadingItems = true;
    this.items = [];

    const source$ = category === 'pickup'
      ? this.pickupService.getPickups()
      : this.opportunityService.getDashboardData();

    source$
      .pipe(
        timeout(15_000),
        finalize(() => {
          this.loadingItems = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          try {
            const rows = res?.data || [];
            this.items = category === 'pickup'
              ? rows.map((pickup: any) => ({
                  id: pickup._id,
                  label: `${(pickup.wasteTypes || []).join(', ') || 'Pickup'} \u00b7 ${pickup.city}`,
                  sublabel: `${new Date(pickup.pickupDate).toLocaleDateString()} \u00b7 ${pickup.timeSlot} \u00b7 ${pickup.status}`,
                }))
              : rows
                  .filter((app: any) => app.opportunity_id)
                  .map((app: any) => ({
                    id: app._id,
                    label: app.opportunity_id?.title || 'Opportunity',
                    sublabel: `${app.opportunity_id?.location || ''} \u00b7 ${app.status}`.trim(),
                  }));
          } catch (err) {
            console.error('Error parsing support items:', err);
            this.error = 'Something went wrong loading your items. Please try again.';
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading support items:', err);
          this.error = err?.name === 'TimeoutError'
            ? 'That took too long to load. Please try again.'
            : (category === 'pickup'
              ? 'Could not load your pickups. Please try again.'
              : 'Could not load your applications. Please try again.');
          this.cdr.detectChanges();
        },
      });
  }

  chooseItem(item: ConcernItem): void {
    this.selectedItem = item;
    this.step = 3;
    this.cdr.detectChanges();
  }

  goBack(): void {
    if (this.step === 3) {
      this.step = 2;
      this.cdr.detectChanges();
      return;
    }
    if (this.step === 2) {
      this.step = 1;
      this.category = null;
      this.items = [];
      this.cdr.detectChanges();
    }
  }

  submit(): void {
    const content = this.concern.trim();
    if (!content || !this.currentUser || !this.category || !this.selectedItem) return;

    this.submitting = true;
    this.error = '';

    this.messageService.getSupportContact().subscribe({
      next: (res: any) => {
        const admin = res.data;
        if (!admin?._id) {
          this.submitting = false;
          this.error = 'No support agent is available right now.';
          this.cdr.detectChanges();
          return;
        }

        this.socketService.joinRoom(this.currentUser._id);
        this.socketService.sendMessage({
          sender_id: this.currentUser._id,
          receiver_id: admin._id,
          content,
          context: {
            type: this.category,
            refId: this.selectedItem!.id,
            label: this.selectedItem!.label,
          },
        });

        this.submitting = false;
        this.router.navigate(['/messages'], { queryParams: { contactId: admin._id } });
      },
      error: (err) => {
        this.submitting = false;
        this.error = err.error?.message || 'Could not reach support. Please try again.';
        this.cdr.detectChanges();
      },
    });
  }
}