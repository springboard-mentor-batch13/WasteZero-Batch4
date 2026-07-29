import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Pickup, PickupService } from '../services/pickup.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-pickups',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pickups.html',
  styleUrl: './pickups.css',
})
export class Pickups implements OnInit {
  user: any;
  form: FormGroup;
  pickups: Pickup[] = [];
  loading = true;
  saving = false;
  error = '';
  statusFilter = 'all';
  readonly today = new Date().toISOString().slice(0, 10);
  readonly statuses: Pickup['status'][] = [
    'scheduled',
    'confirmed',
    'in-progress',
    'completed',
    'cancelled',
  ];

  constructor(
    private fb: FormBuilder,
    private pickupService: PickupService,
    private auth: AuthService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.user = this.auth.getUser();
    this.form = this.fb.group({
      waste_type: ['plastic', Validators.required],
      quantity_kg: [1, [Validators.required, Validators.min(0.1), Validators.max(10000)]],
      pickup_date: ['', Validators.required],
      time_slot: ['morning', Validators.required],
      address: [this.user?.address || this.user?.location || '', [Validators.required, Validators.maxLength(300)]],
      notes: ['', Validators.maxLength(500)],
    });
  }

  get isVolunteer() {
    return this.user?.role === 'volunteer';
  }

  ngOnInit() {
    this.load();
  }

  load(status = this.statusFilter) {
    this.statusFilter = status;
    this.loading = true;
    this.error = '';
    this.pickupService.getAll(status).subscribe({
      next: (pickups) => {
        this.pickups = pickups;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Could not load pickups';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  schedule() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.error = '';
    this.pickupService.create(this.form.value).subscribe({
      next: () => {
        this.toast.success('Pickup scheduled successfully');
        this.form.reset({
          waste_type: 'plastic',
          quantity_kg: 1,
          pickup_date: '',
          time_slot: 'morning',
          address: this.user?.address || this.user?.location || '',
          notes: '',
        });
        this.saving = false;
        this.load();
      },
      error: (err) => {
        this.error = err.error?.message || 'Pickup could not be scheduled';
        this.saving = false;
        this.cdr.detectChanges();
      },
    });
  }

  cancel(pickup: Pickup) {
    if (!confirm('Cancel this pickup request?')) return;
    this.pickupService.cancel(pickup._id).subscribe({
      next: () => {
        this.toast.success('Pickup cancelled');
        this.load();
      },
      error: (err) => this.toast.error(err.error?.message || 'Pickup could not be cancelled'),
    });
  }

  updateStatus(pickup: Pickup, status: string) {
    this.pickupService.updateStatus(pickup._id, status as Pickup['status']).subscribe({
      next: () => {
        this.toast.success(`Pickup marked ${status}`);
        this.load();
      },
      error: (err) => this.toast.error(err.error?.message || 'Status could not be updated'),
    });
  }

  canCancel(pickup: Pickup) {
    return this.isVolunteer && ['scheduled', 'confirmed'].includes(pickup.status);
  }
}
