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

interface DashboardSummary {
  totalPickups: number;
  completedPickups: number;
  assignedPickups: number;
  opportunityCount: number;
  activeOpportunityCount: number;
  applicationCount: number;
  acceptedApplicationCount: number;
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
  pickupSummary: DashboardSummary = this.emptySummary();

  showRejectModal: boolean = false;
  selectedAppIdForReject: string | null = null;
  rejectionRemark: string = '';

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
        this.pickupSummary = { ...this.emptySummary(), ...(res.summary || {}) };

        if (this.role === 'ngo') {
          this.groupApplicationsByOpportunity();
        }

        this.stats = this.statsForRole(this.role);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching dashboard summary data:', err);
        this.pickupSummary = this.emptySummary();
        this.stats = this.statsForRole(this.role);
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

  private statsForRole(role: string): Stat[] {
    if (role === 'admin') {
      return [
        { label: 'Total Applications', value: this.pickupSummary.applicationCount, icon: 'US', tint: '#e8f5e9', change: '', up: true },
        { label: 'System Opportunities', value: this.pickupSummary.opportunityCount, icon: 'OP', tint: '#e3f2fd', change: '', up: true },
        { label: 'Total Pickups', value: this.pickupSummary.totalPickups, icon: 'PK', tint: '#f1f8e9', change: '', up: true },
        { label: 'Pickups Done', value: this.pickupSummary.completedPickups, icon: 'OK', tint: '#fff3e0', change: '', up: true },
      ];
    }
    if (role === 'ngo') {
      return [
        { label: 'Active Opportunities', value: this.pickupSummary.activeOpportunityCount, icon: 'OP', tint: '#e8f5e9', change: '', up: true },
        { label: 'Total Applicants', value: this.pickupSummary.applicationCount, icon: 'AP', tint: '#e3f2fd', change: '', up: true },
        { label: 'Assigned Pickups', value: this.pickupSummary.assignedPickups, icon: 'PK', tint: '#f1f8e9', change: '', up: true },
        { label: 'Pickups Done', value: this.pickupSummary.completedPickups, icon: 'OK', tint: '#fff3e0', change: '', up: true },
      ];
    }
    return [
      { label: 'Total Pickups', value: this.pickupSummary.totalPickups, icon: 'PK', tint: '#e8f5e9', change: '', up: true },
      { label: 'Pickups Done', value: this.pickupSummary.completedPickups, icon: 'OK', tint: '#e3f2fd', change: '', up: true },
      { label: 'Applied Opportunities', value: this.pickupSummary.applicationCount, icon: 'OP', tint: '#f1f8e9', change: '', up: true },
      { label: 'Accepted Applications', value: this.pickupSummary.acceptedApplicationCount, icon: 'AP', tint: '#fff3e0', change: '', up: true },
    ];
  }

  private emptySummary(): DashboardSummary {
    return {
      totalPickups: 0,
      completedPickups: 0,
      assignedPickups: 0,
      opportunityCount: 0,
      activeOpportunityCount: 0,
      applicationCount: 0,
      acceptedApplicationCount: 0,
    };
  }

  private actionsForRole(role: string): QuickAction[] {
    const editProfile: QuickAction = { label: 'Edit my profile', icon: 'ME', link: '/profile' };
    const browseOpportunities: QuickAction = { label: 'Browse opportunities', icon: 'OP', link: '/opportunities' };

    if (role === 'admin') {
      return [
        editProfile,
        { label: 'Schedule a pickup', icon: 'PK', link: '/schedule-pickup' },
        browseOpportunities,
        { label: 'Manage users', icon: 'AD', soon: true },
        { label: 'View reports', icon: 'RP', soon: true },
      ];
    }
    if (role === 'ngo') {
      return [
        editProfile,
        { label: 'Schedule a pickup', icon: 'PK', link: '/schedule-pickup' },
        { label: 'Create opportunity', icon: 'ADD', link: '/opportunities/create' },
        browseOpportunities,
      ];
    }
    return [
      editProfile,
      { label:'Match Suggestions', icon:'MS', link:'/match-suggestions' },
      { label: 'Schedule a pickup', icon: 'PK', link: '/schedule-pickup' },
      browseOpportunities,
    ];
  }
}
