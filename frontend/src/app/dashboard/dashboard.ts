import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { OpportunityService } from '../opportunities/opportunity.service';

interface Stat {
  label: string;
  value: number | string;
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
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  user: any;
  role = 'volunteer';
  greeting = '';
  stats: Stat[] = [];
  actions: QuickAction[] = [];

  categories = [
    { label: 'Plastic', icon: 'PL', pct: 72, color: '#43a047' },
    { label: 'Organic', icon: 'OR', pct: 54, color: '#8bc34a' },
    { label: 'E-waste', icon: 'EW', pct: 38, color: '#26a69a' },
    { label: 'Paper', icon: 'PA', pct: 61, color: '#66bb6a' },
  ];

  activity = [
    { text: 'Plastic pickup completed', time: '2 days ago', dot: 'green' },
    { text: 'New opportunity nearby', time: '4 days ago', dot: 'blue' },
    { text: 'Profile updated', time: 'last week', dot: 'amber' },
  ];

  constructor(
    private auth: AuthService,
    private opportunityService: OpportunityService,
  ) {
    this.user = auth.getUser();
    this.role = this.user?.role || 'volunteer';
    this.greeting = this.greetingForRole(this.role);
    this.actions = this.actionsForRole(this.role);
  }

  ngOnInit() {
    this.opportunityService.getAll({ status: 'open' }).subscribe({
      next: (opps) => {
        this.stats = this.statsForRole(this.role, opps.length);
      },
      error: () => {
        this.stats = this.statsForRole(this.role, 0);
      },
    });
  }

  private greetingForRole(role: string) {
    if (role === 'admin') return 'Platform overview and controls at a glance.';
    if (role === 'ngo') return 'Manage your pickups and volunteer opportunities.';
    return "Here's your recycling overview.";
  }

  private statsForRole(role: string, openOpportunities: number = 0): Stat[] {
    if (role === 'admin') {
      return [
        { label: 'Total Users', value: 42, icon: 'US', tint: '#e8f5e9', change: '8%', up: true },
        { label: 'Opportunities', value: openOpportunities, icon: 'OP', tint: '#e3f2fd', change: '12%', up: true },
        { label: 'Pickups Done', value: 96, icon: 'PK', tint: '#f1f8e9', change: '5%', up: true },
        { label: 'Open Reports', value: 7, icon: 'RP', tint: '#fff3e0', change: '3%', up: false },
      ];
    }
    if (role === 'ngo') {
      return [
        { label: 'My Opportunities', value: openOpportunities, icon: 'OP', tint: '#e8f5e9', change: '2', up: true },
        { label: 'Applicants', value: 23, icon: 'AP', tint: '#e3f2fd', change: '15%', up: true },
        { label: 'Pickups Done', value: 31, icon: 'PK', tint: '#f1f8e9', change: '9%', up: true },
        { label: 'Messages', value: 9, icon: 'MS', tint: '#fff3e0', change: '4', up: true },
      ];
    }
    return [
      { label: 'Total Pickups', value: 28, icon: 'PK', tint: '#e8f5e9', change: '7%', up: true },
      { label: 'Recycled Items', value: 635, icon: 'RC', tint: '#e3f2fd', change: '12%', up: true },
      { label: 'Open Opportunities', value: openOpportunities, icon: 'OP', tint: '#f1f8e9', change: '3', up: true },
      { label: 'Messages', value: 5, icon: 'MS', tint: '#fff3e0', change: '1', up: false },
    ];
  }

  private actionsForRole(role: string): QuickAction[] {
    const editProfile: QuickAction = { label: 'Edit my profile', icon: 'ME', link: '/profile' };
    const browseOpportunities: QuickAction = { label: 'Browse opportunities', icon: 'OP', link: '/opportunities' };

    if (role === 'admin') {
      return [
        editProfile,
        browseOpportunities,
        { label: 'Manage users', icon: 'AD', soon: true },
        { label: 'View reports', icon: 'RP', soon: true },
      ];
    }
    if (role === 'ngo') {
      return [
        editProfile,
        { label: 'Create opportunity', icon: 'ADD', link: '/opportunities/create' },
        browseOpportunities,
        { label: 'View applicants', icon: 'AP', soon: true },
      ];
    }
    return [
      editProfile,
      { label: 'Schedule a pickup', icon: 'PK', soon: true },
      browseOpportunities,
    ];
  }
}
