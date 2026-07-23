import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OpportunityService } from '../opportunities/opportunity.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

interface Application {
  _id: string;
  opportunity_id?: {
    _id: string;
    title: string;
    location?: string;
    status?: string;
    ngo_id?: { _id: string; name: string; email: string };
  };
  volunteer_id?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
    skills?: string[];
  };
  ngo_id?: { _id: string; name: string; email: string };
  status: 'pending' | 'accepted' | 'rejected';
  rejection_remark?: string;
}

interface GroupedOpportunity {
  title: string;
  applications: Application[];
}

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './applications.html',
  styleUrl: './applications.css',
})
export class ApplicationsComponent implements OnInit {
  user: any;
  role: string = 'volunteer';
  isLoading: boolean = false;

  applications: Application[] = [];
  groupedOpportunities: Record<string, GroupedOpportunity> = {};
  selectedOpportunityId: string | null = null;

  showRejectModal: boolean = false;
  selectedAppIdForReject: string | null = null;
  rejectionRemark: string = '';

  constructor(
    private authService: AuthService,
    private opportunityService: OpportunityService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {
    this.user = this.authService.getUser();
    this.role = this.user?.role || 'volunteer';
  }

  ngOnInit(): void {
    this.fetchApplications();
  }

  fetchApplications(): void {
    this.isLoading = true;
    this.opportunityService.getDashboardData().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.applications = res.data || [];

        if (this.role === 'ngo') {
          this.groupApplicationsByOpportunity();
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching applications:', err);
        this.cdr.detectChanges();
      }
    });
  }

  groupApplicationsByOpportunity(): void {
    this.groupedOpportunities = {};
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

  selectOpportunity(oppId: string): void {
    this.selectedOpportunityId = this.selectedOpportunityId === oppId ? null : oppId;
  }

  acceptApplication(appId: string): void {
    if (!confirm('Accept this volunteer application?')) return;

    this.opportunityService.updateApplicationStatus(appId, { status: 'accepted' }).subscribe({
      next: () => {
        this.toast.success('Application accepted');
        this.fetchApplications();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to accept application');
        console.error('Failed to accept application:', err);
      }
    });
  }

  openRejectModal(appId: string): void {
    this.selectedAppIdForReject = appId;
    this.rejectionRemark = '';
    this.showRejectModal = true;
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.selectedAppIdForReject = null;
    this.rejectionRemark = '';
  }

  confirmReject(): void {
    if (!this.selectedAppIdForReject) return;
    if (!confirm('Reject this volunteer application?')) return;

    this.opportunityService.updateApplicationStatus(this.selectedAppIdForReject, {
      status: 'rejected',
      rejection_remark: this.rejectionRemark
    }).subscribe({
      next: () => {
        this.toast.success('Application rejected');
        this.closeRejectModal();
        this.fetchApplications();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to reject application');
        console.error('Failed to reject application:', err);
      }
    });
  }

  getNgoDisplay(app: Application): string {
    const ngo = app.opportunity_id?.ngo_id || app.ngo_id;
    if (!ngo) return 'N/A';
    
    const ngoName = ngo.name || ngo.email || 'NGO';
    const rawId = ngo._id ? String(ngo._id) : '';
    const lastSixId = rawId.length >= 6 ? rawId.slice(-6).toUpperCase() : rawId;
    
    return lastSixId ? `${ngoName} (${lastSixId})` : ngoName;
  }

  get ObjectKeys(): string[] {
    return Object.keys(this.groupedOpportunities);
  }
}
