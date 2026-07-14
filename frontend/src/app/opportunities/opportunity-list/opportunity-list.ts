import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { OpportunityService } from '../opportunity.service';
import { Opportunity } from '../opportunity.model';
import { AuthService } from '../../services/auth.service';

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
  applyingId = '';
  appliedIds: Set<string> = new Set();

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private opportunityService: OpportunityService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  get userRole() {
    return this.auth.getUser()?.role;
  }
  get canManage() {
    return this.userRole === 'admin' || this.userRole === 'ngo';
  }

  ngOnInit() {
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadOpportunities();
      });

    this.loadOpportunities();

    if (!this.canManage) {
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

    this.opportunityService
      .getAll({
        status: this.statusFilter,
        search: this.search,
      })
      .subscribe({
        next: (data) => {
          this.opportunities = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error =
            err.name === 'TimeoutError'
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

        applications.forEach((app) => {
          this.appliedIds.add(app.opportunity_id._id);
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load applications', err);
      },
    });
  }

  onSearch() {
    this.searchSubject.next(this.search);
  }

  onFilterChange() {
    this.loadOpportunities();
  }

  deleteOpportunity(id: string) {
    if (
      !confirm('Are you sure? This will permanently delete the opportunity and all applications.')
    )
      return;
    this.opportunityService.delete(id).subscribe({
      next: () => {
        this.opportunities = this.opportunities.filter((o) => o._id !== id);
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
        this.applyingId = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to apply');
        this.applyingId = '';
        this.cdr.detectChanges();
      },
    });
  }

  statusColor(status: string): string {
    return status === 'open' ? '#2e7d32' : status === 'closed' ? '#c62828' : '#e65100';
  }
}
