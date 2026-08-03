import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, timeout } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { PickupService } from '../services/pickup.service';
import { ToastService } from '../services/toast.service';

interface PickupRequest {
  _id: string;
  address: string;
  city: string;
  pickupDate: string;
  timeSlot: string;
  wasteTypes: string[];
  notes: string;
  status: 'scheduled' | 'assigned' | 'completed' | 'cancelled';
  requester_id?: { _id: string; name: string; email: string; role: string };
  assigned_to?: { _id: string; name: string; email: string; role: string };
}

@Component({
  selector: 'app-schedule-pickup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule-pickup.html',
  styleUrl: './schedule-pickup.css',
})
export class SchedulePickup implements OnInit {
  activeTab: 'schedule' | 'history' = 'schedule';
  step = 1;
  loading = false;
  loadingHistory = true;
  error = '';
  pickups: PickupRequest[] = [];
  user: any;

  respondingPickupId: string | null = null;

  form = {
    address: '',
    city: '',
    pickupDate: '',
    timeSlot: '',
    wasteTypes: [] as string[],
    notes: '',
  };

  readonly wasteOptions = [
    'Plastic',
    'Glass',
    'Electronic Waste',
    'Paper',
    'Metal',
    'Organic Waste',
    'Other',
  ];

  readonly timeSlots = [
    { value: '08:00-11:00', label: 'Morning · 8:00 AM – 11:00 AM' },
    { value: '11:00-14:00', label: 'Midday · 11:00 AM – 2:00 PM' },
    { value: '14:00-17:00', label: 'Afternoon · 2:00 PM – 5:00 PM' },
    { value: '17:00-20:00', label: 'Evening · 5:00 PM – 8:00 PM' },
  ];

  constructor(
    private pickupService: PickupService,
    private auth: AuthService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.user = this.auth.getUser();
  }

  ngOnInit(): void {
    if (!this.isVolunteer) {
      this.activeTab = 'history';
    }
    this.loadHistory();
  }

  get minDate(): string {
    const date = new Date();
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60_000).toISOString().split('T')[0];
  }

  get isVolunteer(): boolean {
    return this.user?.role === 'volunteer';
  }

  get isNgo(): boolean {
    return this.user?.role === 'ngo';
  }

  get isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  get scheduledCount(): number {
    return this.pickups.filter((pickup) => ['scheduled', 'assigned'].includes(pickup.status)).length;
  }

  get completedCount(): number {
    return this.pickups.filter((pickup) => pickup.status === 'completed').length;
  }

  // A pickup this NGO can still accept/reject (unclaimed, pool item).
  isPendingForNgo(pickup: PickupRequest): boolean {
    return this.isNgo && pickup.status === 'scheduled';
  }

  // A pickup this NGO has already accepted and is responsible for.
  isAcceptedByThisNgo(pickup: PickupRequest): boolean {
    return this.isNgo && pickup.status === 'assigned' && pickup.assigned_to?._id === this.user?._id;
  }

  selectTab(tab: 'schedule' | 'history'): void {
    this.activeTab = tab;
    if (tab === 'history') this.loadHistory();
  }

  nextStep(): void {
    this.error = '';
    if (!this.form.address.trim() || !this.form.city.trim() || !this.form.pickupDate || !this.form.timeSlot) {
      this.error = 'Complete the address, city, pickup date, and preferred time slot.';
      return;
    }
    this.step = 2;
  }

  toggleWaste(type: string, checked: boolean): void {
    this.form.wasteTypes = checked
      ? [...new Set([...this.form.wasteTypes, type])]
      : this.form.wasteTypes.filter((item) => item !== type);
  }

  isWasteSelected(type: string): boolean {
    return this.form.wasteTypes.includes(type);
  }

  schedulePickup(): void {
    this.error = '';
    if (!this.form.wasteTypes.length) {
      this.error = 'Select at least one waste type.';
      return;
    }

    if (this.loading) return;

    this.loading = true;
    this.pickupService.createPickup(this.form).pipe(
      timeout(15_000),
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      }),
    ).subscribe({
      next: () => {
        this.toast.success('Pickup scheduled successfully');
        this.resetForm();
        this.activeTab = 'history';
        this.loadHistory();
      },
      error: (err) => {
        this.error = err.name === 'TimeoutError'
          ? 'The server took too long to respond. Check Pickup History before trying again.'
          : err.error?.message || 'Could not schedule the pickup.';
      },
    });
  }

  loadHistory(): void {
    this.loadingHistory = true;
    this.pickupService.getPickups().pipe(
      timeout(15_000),
      finalize(() => {
        this.loadingHistory = false;
        this.cdr.detectChanges();
      }),
    ).subscribe({
      next: (res: any) => {
        this.pickups = res.data || [];
      },
      error: (err) => {
        this.error = err.name === 'TimeoutError'
          ? 'Pickup history took too long to load. Please try again.'
          : err.error?.message || 'Could not load pickup history.';
      },
    });
  }

  updateStatus(pickup: PickupRequest, status: string): void {
    this.pickupService.updateStatus(pickup._id, status).subscribe({
      next: (res: any) => {
        const updated = res.data;
        this.pickups = this.pickups.map((item) => item._id === updated._id ? updated : item);
        this.toast.success(`Pickup marked ${status}`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Could not update pickup status');
        this.cdr.detectChanges();
      },
    });
  }

  // NGO accepting or rejecting an unclaimed pickup a volunteer created.
  respondToPickup(pickup: PickupRequest, accept: boolean): void {
    this.respondingPickupId = pickup._id;
    const action = accept ? this.pickupService.acceptPickup(pickup._id) : this.pickupService.rejectPickup(pickup._id);
    action.pipe(
      finalize(() => {
        this.respondingPickupId = null;
        this.cdr.detectChanges();
      }),
    ).subscribe({
      next: (res: any) => {
        const updated = res.data;
        this.pickups = accept
          ? this.pickups.map((item) => item._id === updated._id ? updated : item)
          : this.pickups.filter((item) => item._id !== updated._id); // no longer in this NGO's pool once declined
        this.toast.success(accept ? 'Pickup accepted' : 'Pickup declined');
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Could not respond to this pickup.');
      },
    });
  }

  private resetForm(): void {
    this.form = {
      address: '',
      city: '',
      pickupDate: '',
      timeSlot: '',
      wasteTypes: [],
      notes: '',
    };
    this.step = 1;
  }
}
