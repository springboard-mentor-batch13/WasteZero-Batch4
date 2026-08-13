import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel implements OnInit {
  activeTab: 'overview' | 'users' | 'activity' = 'overview';
  overview: any = null;
  activity: any = null;
  users: any[] = [];
  loading = true;
  updatingId = '';
  search = '';
  role = 'all';
  status = 'all';
  currentUser: any;

  constructor(private admin: AdminService, auth: AuthService, private toast: ToastService) {
    this.currentUser = auth.getUser();
  }

  ngOnInit(): void { this.loadAll(); }

  loadAll(): void {
    this.loading = true;
    forkJoin({ overview: this.admin.getOverview(), activity: this.admin.getActivity(), users: this.admin.getUsers({}) })
      .subscribe({
        next: ({ overview, activity, users }) => {
          this.overview = overview.data;
          this.activity = activity.data;
          this.users = users.data || [];
          this.loading = false;
        },
        error: (err) => { this.loading = false; this.toast.error(err.error?.message || 'Could not load Admin Panel'); },
      });
  }

  loadUsers(): void {
    this.admin.getUsers({ search: this.search.trim(), role: this.role, status: this.status }).subscribe({
      next: (res) => this.users = res.data || [],
      error: (err) => this.toast.error(err.error?.message || 'Could not load users'),
    });
  }

  updateRole(user: any, role: string): void {
    if (role === user.role) return;
    this.updateUser(user, { role }, `Role changed to ${role}`);
  }

  toggleUser(user: any): void {
    const activate = user.isActive === false;
    if (!activate && !confirm(`Suspend ${user.name}? They will immediately lose access.`)) return;
    this.updateUser(user, { isActive: activate }, activate ? 'Account reactivated' : 'Account suspended');
  }

  private updateUser(user: any, update: any, success: string): void {
    this.updatingId = user._id;
    this.admin.updateUser(user._id, update).subscribe({
      next: (res) => {
        this.users = this.users.map(item => item._id === user._id ? res.data : item);
        this.updatingId = '';
        this.toast.success(success);
        this.admin.getOverview().subscribe(value => this.overview = value.data);
      },
      error: (err) => { this.updatingId = ''; this.toast.error(err.error?.message || 'Could not update user'); },
    });
  }

  count(rows: any[], key: string): number { return rows?.find(row => row._id === key)?.count || 0; }
  total(rows: any[]): number { return (rows || []).reduce((sum, row) => sum + row.count, 0); }
  isSelf(user: any): boolean { return user._id === this.currentUser?._id; }
}
