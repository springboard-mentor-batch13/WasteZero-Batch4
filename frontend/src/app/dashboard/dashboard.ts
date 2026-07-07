import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface Stat {
  label: string;
  value: number;
  icon: string;
  tint: string;
  change: string;
  up: boolean;
}

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
  stats: Stat[] = [];
  actions: QuickAction[] = [];

  categories = [
    { label: 'Plastic', icon: '🧴', pct: 72, color: '#43a047' },
    { label: 'Organic', icon: '🌿', pct: 54, color: '#8bc34a' },
    { label: 'E-waste', icon: '🔌', pct: 38, color: '#26a69a' },
    { label: 'Paper', icon: '📄', pct: 61, color: '#66bb6a' },
  ];

  activity = [
    { text: 'Plastic pickup completed', time: '2 days ago', dot: 'green' },
    { text: 'New opportunity nearby', time: '4 days ago', dot: 'blue' },
    { text: 'Profile updated', time: 'last week', dot: 'amber' },
  ];

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

  private statsForRole(role: string): Stat[] {
    if (role === 'admin') {
      return [
        { label: 'Total Users', value: 42, icon: '👥', tint: '#e8f5e9', change: '8%', up: true },
        { label: 'Opportunities', value: 18, icon: '🌱', tint: '#e3f2fd', change: '12%', up: true },
        { label: 'Pickups Done', value: 96, icon: '🚚', tint: '#f1f8e9', change: '5%', up: true },
        { label: 'Open Reports', value: 7, icon: '📊', tint: '#fff3e0', change: '3%', up: false },
      ];
    }
    if (role === 'ngo') {
      return [
        { label: 'My Opportunities', value: 6, icon: '🌱', tint: '#e8f5e9', change: '2', up: true },
        { label: 'Applicants', value: 23, icon: '📨', tint: '#e3f2fd', change: '15%', up: true },
        { label: 'Pickups Done', value: 31, icon: '🚚', tint: '#f1f8e9', change: '9%', up: true },
        { label: 'Messages', value: 9, icon: '💬', tint: '#fff3e0', change: '4', up: true },
      ];
    }
    return [
      { label: 'Total Pickups', value: 28, icon: '🚚', tint: '#e8f5e9', change: '7%', up: true },
      { label: 'Recycled Items', value: 635, icon: '♻️', tint: '#e3f2fd', change: '12%', up: true },
      { label: 'Open Opportunities', value: 12, icon: '🌱', tint: '#f1f8e9', change: '3', up: true },
      { label: 'Messages', value: 5, icon: '💬', tint: '#fff3e0', change: '1', up: false },
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
