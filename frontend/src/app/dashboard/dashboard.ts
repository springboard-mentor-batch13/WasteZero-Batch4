import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { OpportunityService } from '../opportunities/opportunity.service';
import { ToastService } from '../services/toast.service';

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

interface Application {
  _id: string;
  opportunity_id?: {
    _id: string;
    title: string;
    location?: string;
    status?: string;
    ngo_id?: { name: string; email: string };
  };
  volunteer_id?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
    skills?: string[];
  };
  ngo_id?: { name: string; email: string };
  status: 'pending' | 'accepted' | 'rejected';
  rejection_remark?: string;
}

interface GroupedOpportunity {
  title: string;
  applications: Application[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  user: any;
  role = 'volunteer';
  greeting = '';
  stats: Stat[] = [];
  actions: QuickAction[] = [];

  applications: Application[] = [];
  groupedOpportunities: Record<string, GroupedOpportunity> = {};
  selectedOpportunityId: string | null = null;
  isLoading: boolean = false;

  showRejectModal: boolean = false;
  selectedAppIdForReject: string | null = null;
  rejectionRemark: string = '';

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
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
  ) {
    this.user = auth.getUser();
    this.role = this.user?.role || 'volunteer';
    this.greeting = this.greetingForRole(this.role);
    this.actions = this.actionsForRole(this.role);
  }

  ngOnInit() {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.isLoading = true;

    this.opportunityService.getDashboardData().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.applications = res.data || [];

        if (this.role === 'ngo') {
          this.groupApplicationsByOpportunity();
        }

        const openOppsCount = this.role === 'ngo' 
          ? Object.keys(this.groupedOpportunities).length 
          : this.applications.length;

        this.stats = this.statsForRole(this.role, openOppsCount);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching dashboard summary data:', err);
        this.stats = this.statsForRole(this.role, 0);
        this.cdr.detectChanges();
      },
    });
  }

  groupApplicationsByOpportunity() {
    this.groupedOpportunities = {};

    // Group all applications for NGO review (including accepted and rejected)
    this.applications.forEach(app => {
      const oppId = app.opportunity_id?._id || 'unknown';
      if (!this.groupedOpportunities[oppId]) {
        this.groupedOpportunities[oppId] = {
          title: app.opportunity_id?.title || 'Opportunity Details',
          applications: []
        };
      }
      this.groupedOpportunities[oppId].applications.push(app);
    });
  }

  selectOpportunity(oppId: string) {
    this.selectedOpportunityId = this.selectedOpportunityId === oppId ? null : oppId;
  }

  acceptApplication(appId: string) {
    if (!confirm('Accept this volunteer application?')) return;

    this.opportunityService.updateApplicationStatus(appId, { status: 'accepted' }).subscribe({
      next: () => {
        this.toast.success('Application accepted');
        this.fetchDashboardData();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to accept application');
        console.error('Failed to accept application:', err);
      }
    });
  }

  openRejectModal(appId: string) {
    this.selectedAppIdForReject = appId;
    this.rejectionRemark = '';
    this.showRejectModal = true;
  }

  closeRejectModal() {
    this.showRejectModal = false;
    this.selectedAppIdForReject = null;
    this.rejectionRemark = '';
  }

  confirmReject() {
    if (!this.selectedAppIdForReject) return;
    if (!confirm('Reject this volunteer application?')) return;

    this.opportunityService.updateApplicationStatus(this.selectedAppIdForReject, {
      status: 'rejected',
      rejection_remark: this.rejectionRemark
    }).subscribe({
      next: () => {
        this.toast.success('Application rejected');
        this.closeRejectModal();
        this.fetchDashboardData();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to reject application');
        console.error('Failed to reject application:', err);
      }
    });
  }

  get ObjectKeys(): string[] {
    return Object.keys(this.groupedOpportunities);
  }

  private greetingForRole(role: string) {
    if (role === 'admin') return 'Platform overview and controls at a glance.';
    if (role === 'ngo') return 'Manage your pickups, applications and volunteer opportunities.';
    return "Here's your recycling overview and application status.";
  }

  private statsForRole(role: string, metricCount: number = 0): Stat[] {
    if (role === 'admin') {
      return [
        { label: 'Total Applications', value: this.applications.length, icon: 'US', tint: '#e8f5e9', change: '8%', up: true },
        { label: 'System Opportunities', value: metricCount, icon: 'OP', tint: '#e3f2fd', change: '12%', up: true },
        { label: 'Pickups Done', value: 96, icon: 'PK', tint: '#f1f8e9', change: '5%', up: true },
        { label: 'Open Reports', value: 7, icon: 'RP', tint: '#fff3e0', change: '3%', up: false },
      ];
    }
    if (role === 'ngo') {
      return [
        { label: 'Active Opportunities', value: metricCount, icon: 'OP', tint: '#e8f5e9', change: '2', up: true },
        { label: 'Total Applicants', value: this.applications.length, icon: 'AP', tint: '#e3f2fd', change: '15%', up: true },
        { label: 'Pickups Done', value: 31, icon: 'PK', tint: '#f1f8e9', change: '9%', up: true },
        { label: 'Messages', value: 9, icon: 'MS', tint: '#fff3e0', change: '4', up: true },
      ];
    }
    return [
      { label: 'Total Pickups', value: 28, icon: 'PK', tint: '#e8f5e9', change: '7%', up: true },
      { label: 'Recycled Items', value: 635, icon: 'RC', tint: '#e3f2fd', change: '12%', up: true },
      { label: 'Applied Opportunities', value: this.applications.length, icon: 'OP', tint: '#f1f8e9', change: '3', up: true },
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
      ];
    }
    return [
      editProfile,
      { label: 'Schedule a pickup', icon: 'PK', soon: true },
      browseOpportunities,
    ];
  }
}
