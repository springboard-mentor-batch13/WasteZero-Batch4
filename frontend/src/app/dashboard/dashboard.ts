import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface QuickAction {
  label: string;
  icon: string;
  link?: string;
  soon?: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  user: any;
  role = 'volunteer';
  greeting = '';
  stats: { label: string; value: number; icon: string; tint: string }[] = [];
  actions: QuickAction[] = [];

  constructor(auth: AuthService) {
    this.user = auth.getUser();
    this.role = this.user?.role || 'volunteer';
    this.greeting = this.greetingForRole(this.role);
    this.stats = this.statsForRole(this.role);
    this.actions = this.actionsForRole(this.role);
  }

  private greetingForRole(role: string) {
    if (role === 'admin') return 'Platform overview and controls at a glance.';
    if (role === 'ngo') return 'Manage your pickups and volunteer opportunities.';
    return "Here's your recycling overview.";
  }

  private statsForRole(role: string) {
    if (role === 'admin') {
      return [
        { label: 'Total Users', value: 42, icon: '👥', tint: '#e8f5e9' },
        { label: 'Opportunities', value: 18, icon: '🌱', tint: '#e3f2fd' },
        { label: 'Pickups Done', value: 96, icon: '🚚', tint: '#f1f8e9' },
        { label: 'Reports', value: 7, icon: '📊', tint: '#fff3e0' },
      ];
    }
    if (role === 'ngo') {
      return [
        { label: 'My Opportunities', value: 6, icon: '🌱', tint: '#e8f5e9' },
        { label: 'Applicants', value: 23, icon: '📨', tint: '#e3f2fd' },
        { label: 'Pickups Done', value: 31, icon: '🚚', tint: '#f1f8e9' },
        { label: 'Messages', value: 9, icon: '💬', tint: '#fff3e0' },
      ];
    }
    return [
      { label: 'Total Pickups', value: 28, icon: '🚚', tint: '#e8f5e9' },
      { label: 'Recycled Items', value: 635, icon: '♻️', tint: '#e3f2fd' },
      { label: 'Open Opportunities', value: 12, icon: '🌱', tint: '#f1f8e9' },
      { label: 'Messages', value: 5, icon: '💬', tint: '#fff3e0' },
    ];
  }

  private actionsForRole(role: string): QuickAction[] {
    const editProfile: QuickAction = { label: 'Edit my profile', icon: '👤', link: '/profile' };
    if (role === 'admin') {
      return [
        editProfile,
        { label: 'Manage users', icon: '🛡️', soon: true },
        { label: 'View reports', icon: '📊', soon: true },
      ];
    }
    if (role === 'ngo') {
      return [
        editProfile,
        { label: 'Create opportunity', icon: '➕', soon: true },
        { label: 'View applicants', icon: '📨', soon: true },
      ];
    }
    return [
      editProfile,
      { label: 'Schedule a pickup', icon: '📅', soon: true },
      { label: 'Browse opportunities', icon: '🌱', soon: true },
    ];
  }
}
