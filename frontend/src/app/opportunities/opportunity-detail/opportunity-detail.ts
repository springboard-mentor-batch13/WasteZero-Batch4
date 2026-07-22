import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OpportunityService } from '../opportunity.service';
import { Opportunity } from '../opportunity.model';
import { AuthService } from '../../services/auth.service';

interface OpportunityApplication {
  _id: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  reviewed_at?: string | null;
  rejection_remark?: string;
  reviewed_by?: {
    _id: string;
    name?: string;
    email?: string;
    role?: string;
  } | null;
  volunteer_id?: {
    _id: string;
    name?: string;
    email?: string;
    location?: string;
    skills?: string[];
  } | null;
}

@Component({
  selector: 'app-opportunity-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './opportunity-detail.html',
  styleUrl: './opportunity-detail.css',
})
export class OpportunityDetail implements OnInit {
  opportunity: Opportunity | null = null;
  loading = true;
  error = '';
  deleting = false;
  applying = false;
  applied = false;
  volunteerApplicationStatus: 'pending' | 'accepted' | 'rejected' | '' = '';
  volunteerRejectionRemark = '';
  volunteerReviewedAt = '';
  volunteerReviewedBy = '';
  applications: OpportunityApplication[] = [];
  applicationsLoading = false;
  applicationsError = '';
  applicationMode: 'review' | 'admin' | '' = '';
  applicationSummary = {
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  };
  updatingApplicationIds = new Set<string>();

  // Rejection Remark Modal State
  showRejectModal = false;
  selectedAppForReject: OpportunityApplication | null = null;
  rejectionRemark = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private opportunityService: OpportunityService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  get canManage() {
    const user = this.auth.getUser();
    if (!user) return false;
    if (user.role === 'admin') return true;
    const ownerId = (this.opportunity?.ngo_id as any)?._id || this.opportunity?.ngo_id;
    return user.role === 'ngo' && ownerId === user._id;
  }

  get isVolunteer() {
    return this.auth.getUser()?.role === 'volunteer';
  }

  get isAdmin() {
    return this.auth.getUser()?.role === 'admin';
  }

  get canReviewApplications() {
    const user = this.auth.getUser();
    if (!user || user.role !== 'ngo') return false;
    const ownerId = (this.opportunity?.ngo_id as any)?._id || this.opportunity?.ngo_id;
    return ownerId === user._id;
  }

  get canViewApplicationStatus() {
    return this.canReviewApplications || this.isAdmin;
  }

  get pendingCount() {
    return this.applicationSummary.pending;
  }

  get acceptedCount() {
    return this.applicationSummary.accepted;
  }

  get rejectedCount() {
    return this.applicationSummary.rejected;
  }

  get postedBy() {
    const ngo = this.opportunity?.ngo_id;
    return ngo?.name || ngo?.email || 'WasteZero partner';
  }

  get postedId() {
    const id = this.opportunity?.ngo_id?._id || this.opportunity?.ngo_id;
    return id ? String(id).slice(-6).toUpperCase() : 'N/A';
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.opportunityService.getById(id).subscribe({
      next: (opp) => {
        this.opportunity = opp;
        this.loading = false;
        if (this.canViewApplicationStatus) {
          this.loadApplications(id);
        }
        if (this.isVolunteer) {
          this.opportunityService.getMyApplications().subscribe({
            next: (apps: any[]) => {
              const currentApplication = apps.find((app) => {
                const oppId = typeof app.opportunity_id === 'object' ? app.opportunity_id._id : app.opportunity_id;
                return oppId === id;
              });
              this.applied = Boolean(currentApplication);
              this.volunteerApplicationStatus = currentApplication?.status || '';
              this.volunteerRejectionRemark = currentApplication?.rejection_remark || '';
              this.volunteerReviewedAt = currentApplication?.reviewed_at || '';
              this.volunteerReviewedBy = currentApplication?.reviewed_by?.name || currentApplication?.reviewed_by?.email || '';
              this.cdr.detectChanges();
            },
          });
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load opportunity';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadApplications(id = this.opportunity?._id || '') {
    if (!id) return;

    this.applicationsLoading = true;
    this.applicationsError = '';
    this.cdr.detectChanges();

    this.opportunityService.getApplications(id).subscribe({
      next: (response: any) => {
        this.applicationMode = response.mode || (this.canReviewApplications ? 'review' : 'admin');
        this.applications = Array.isArray(response) ? response : response.applications || [];
        this.applicationSummary = response.summary || {
          total: this.applications.length,
          pending: this.applications.filter((app) => app.status === 'pending').length,
          accepted: this.applications.filter((app) => app.status === 'accepted').length,
          rejected: this.applications.filter((app) => app.status === 'rejected').length,
        };
        this.applicationsLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.applicationsError = err.error?.message || 'Failed to load applications';
        this.applicationsLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  updateApplicationStatus(application: OpportunityApplication, status: 'accepted' | 'rejected', remark: string = '') {
    if (!this.canReviewApplications) {
      this.applicationsError = 'Only the owning NGO can update application status';
      return;
    }

    this.updatingApplicationIds.add(application._id);
    this.cdr.detectChanges();

    const payload = {
      status,
      rejection_remark: remark,
    };

    this.opportunityService.updateApplicationStatus(application._id, payload).subscribe({
      next: (updated) => {
        this.applications = this.applications.map((item) =>
          item._id === application._id ? updated : item,
        );
        this.applicationSummary = {
          total: this.applications.length,
          pending: this.applications.filter((app) => app.status === 'pending').length,
          accepted: this.applications.filter((app) => app.status === 'accepted').length,
          rejected: this.applications.filter((app) => app.status === 'rejected').length,
        };
        this.updatingApplicationIds.delete(application._id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.applicationsError = err.error?.message || 'Failed to update application';
        this.updatingApplicationIds.delete(application._id);
        this.cdr.detectChanges();
      },
    });
  }

  openRejectModal(application: OpportunityApplication) {
    this.selectedAppForReject = application;
    this.rejectionRemark = '';
    this.showRejectModal = true;
    this.cdr.detectChanges();
  }

  closeRejectModal() {
    this.showRejectModal = false;
    this.selectedAppForReject = null;
    this.rejectionRemark = '';
    this.cdr.detectChanges();
  }

  confirmReject() {
    if (!this.selectedAppForReject) return;
    const app = this.selectedAppForReject;
    const remark = this.rejectionRemark;
    this.closeRejectModal();
    this.updateApplicationStatus(app, 'rejected', remark);
  }

  isUpdatingApplication(id: string) {
    return this.updatingApplicationIds.has(id);
  }

  deleteOpportunity() {
    if (!this.opportunity) return;
    if (!confirm('Delete this opportunity and all related applications?')) return;

    this.deleting = true;
    this.cdr.detectChanges();

    this.opportunityService.delete(this.opportunity._id).subscribe({
      next: () => this.router.navigate(['/opportunities']),
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete opportunity';
        this.deleting = false;
        this.cdr.detectChanges();
      },
    });
  }

  applyForOpportunity() {
    if (!this.opportunity) return;

    this.applying = true;
    this.cdr.detectChanges();

    this.opportunityService.apply(this.opportunity._id).subscribe({
      next: () => {
        this.applied = true;
        this.volunteerApplicationStatus = 'pending';
        this.applying = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to apply';
        this.applying = false;
        this.cdr.detectChanges();
      },
    });
  }

  statusClass(status: string) {
    return `status ${status}`;
  }

  applicationStatusClass(status: string) {
    return `application-status ${status}`;
  }

  volunteerStatusText() {
    if (this.volunteerApplicationStatus === 'accepted') return 'Your request has been accepted.';
    if (this.volunteerApplicationStatus === 'rejected') {
      return this.volunteerRejectionRemark 
        ? `Your request was rejected. Reason: ${this.volunteerRejectionRemark}` 
        : 'Your request was rejected.';
    }
    if (this.volunteerApplicationStatus === 'pending') return 'Your request is pending NGO review.';
    return '';
  }

  reviewedBy(application: OpportunityApplication) {
    const reviewer = application.reviewed_by;
    return reviewer?.name || reviewer?.email || (application.status === 'accepted' ? this.postedBy : '');
  }

  imageFor(opp: Opportunity): string {
    if (opp.image_url) return opp.image_url;

    const text = `${opp.title} ${opp.description}`.toLowerCase();
    if (text.includes('e-waste') || text.includes('electronics')) {
      return '/demo-ewaste.svg';
    }
    if (text.includes('plastic') || text.includes('cleanup') || text.includes('clean')) {
      return '/demo-cleanup.svg';
    }
    return '/demo-opportunity.svg';
  }
}