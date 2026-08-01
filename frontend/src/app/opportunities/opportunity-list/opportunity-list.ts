import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { OpportunityService } from '../opportunity.service';
import { Opportunity } from '../opportunity.model';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-opportunity-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './opportunity-list.html',
  styleUrl: './opportunity-list.css',
})
export class OpportunityList implements OnInit, OnDestroy {
  opportunities: Opportunity[] = [];
  loading = true;
  error = '';
  search = '';
  statusFilter = 'all';
  cityFilter = 'all';
  cities: string[] = [];
  applyingId = '';
  appliedIds: Set<string> = new Set();
  applicationStatuses = new Map<string, 'pending' | 'accepted' | 'rejected'>();

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private opportunityService: OpportunityService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,  
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
  ) {}

get userRole() { return this.auth.getUser()?.role; }
  get canCreate() { return this.userRole === 'admin' || this.userRole === 'ngo'; }
  get isVolunteer() { return this.userRole === 'volunteer'; }
  get totalCount() { return this.opportunities.length; }

  canManageOpp(opp: Opportunity): boolean {
    const user = this.auth.getUser();
    if (!user) return false;
    if (user.role === 'admin') return true;
    const ownerId = (opp.ngo_id as any)?._id || opp.ngo_id;
    return user.role === 'ngo' && ownerId === user._id;
  }
  get openCount() { return this.opportunities.filter(opp => opp.status === 'open').length; }
  get cityCount() { return this.cities.length; }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.search = params['search'];
      }
      this.loadOpportunities();
    });

    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadOpportunities();
      });

    if (this.auth.getUser()?.role === 'volunteer') {
      this.loadMyApplications();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOpportunities() {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.opportunityService.getAll({
      status: this.statusFilter,
      search: this.search,
      city: this.cityFilter,
    }).subscribe({
      next: (data) => {
        this.opportunities = data;

        const allCities = data
          .map(o => o.location?.trim())
          .filter(Boolean) as string[];
        this.cities = [...new Set(allCities)].sort();

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.name === 'TimeoutError'
          ? 'Request timed out. Please check if the backend is running.'
          : err.error?.message || 'Failed to load opportunities';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadMyApplications() {
    this.opportunityService.getMyApplications().subscribe({
      next: (applications: any[]) => {
        this.appliedIds.clear();
        this.applicationStatuses.clear();
        applications.forEach(app => {
          const opportunityId = typeof app.opportunity_id === 'object'
            ? app.opportunity_id._id
            : app.opportunity_id;
          this.appliedIds.add(opportunityId);
          this.applicationStatuses.set(opportunityId, app.status || 'pending');
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load applications', err),
    });
  }

  onSearch() { this.searchSubject.next(this.search); }
  onFilterChange() { this.loadOpportunities(); }
  onCityChange() { this.loadOpportunities(); }

  clearSearch() {
    this.search = '';
    this.router.navigate(['/opportunities']);
  }

  deleteOpportunity(id: string) {
    if (!confirm('Are you sure? This will permanently delete the opportunity and all applications.')) return;
    this.opportunityService.delete(id).subscribe({
      next: () => {
        this.opportunities = this.opportunities.filter(o => o._id !== id);
        this.cdr.detectChanges();
      },
      error: () => alert('Failed to delete opportunity'),
    });
  }

  applyForOpportunity(id: string) {
    this.applyingId = id;
    this.cdr.detectChanges();
    this.opportunityService.apply(id).subscribe({
      next: () => {
        this.appliedIds.add(id);
        this.applicationStatuses.set(id, 'pending');
        this.applyingId = '';
        this.toast.success('Application sent successfully');
        this.loadMyApplications();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to apply');
        this.applyingId = '';
        this.cdr.detectChanges();
      },
    });
  }

  statusColor(status: string): string {
    return status === 'open' ? '#2e7d32' : status === 'closed' ? '#c62828' : '#e65100';
  }

  applicationStatus(oppId: string) {
    return this.applicationStatuses.get(oppId);
  }

  applicationStatusLabel(oppId: string) {
    const status = this.applicationStatus(oppId);
    if (status === 'accepted') return 'Accepted';
    if (status === 'rejected') return 'Rejected';
    if (status === 'pending') return 'Pending';
    return '';
  }

  applicationStatusClass(oppId: string) {
    return `application-chip ${this.applicationStatus(oppId) || ''}`;
  }

  excerpt(text: string): string {
    if (!text) return '';
    return text.length > 110 ? `${text.slice(0, 110)}...` : text;
  }

  ngoLabel(opp: Opportunity): string {
  const ngo = opp.ngo_id;

  if (!ngo) return 'Unknown NGO';

  // If ngo_id is populated (object)
  if (typeof ngo === 'object' && ngo._id) {
    return ngo._id.slice(-6);
  }

  // If ngo_id is just a string
  return String(ngo).slice(-6);
}

  imageFor(opp: Opportunity): string {
    if (opp.image_url) return opp.image_url;
    const text = `${opp.title} ${opp.description}`.toLowerCase();
    if (text.includes('e-waste') || text.includes('electronics')) return '/demo-ewaste.svg';
    if (text.includes('plastic') || text.includes('cleanup') || text.includes('clean')) return '/demo-cleanup.svg';
    return '/demo-opportunity.svg';
  }
}
