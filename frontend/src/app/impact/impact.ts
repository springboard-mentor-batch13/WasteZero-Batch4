import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { OpportunityService } from '../opportunities/opportunity.service';

interface ImpactSummary {
  totalPickups: number;
  completedPickups: number;
  assignedPickups: number;
  opportunityCount: number;
  activeOpportunityCount: number;
  applicationCount: number;
  acceptedApplicationCount: number;
}

@Component({
  selector: 'app-impact',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './impact.html',
  styleUrl: './impact.css',
})
export class Impact implements OnInit {
  user: any;
  loading = true;
  error = '';
  summary: ImpactSummary = this.emptySummary();

  constructor(
    private readonly auth: AuthService,
    private readonly opportunities: OpportunityService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.user = this.auth.getUser();
  }

  ngOnInit(): void {
    this.loadImpact();
  }

  get isNgo(): boolean {
    return this.user?.role === 'ngo';
  }

  get isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  get completionRate(): number {
    if (!this.summary.totalPickups) return 0;
    return Math.round((this.summary.completedPickups / this.summary.totalPickups) * 100);
  }

  get acceptanceRate(): number {
    if (!this.summary.applicationCount) return 0;
    return Math.round((this.summary.acceptedApplicationCount / this.summary.applicationCount) * 100);
  }

  loadImpact(): void {
    this.loading = true;
    this.error = '';
    this.opportunities.getDashboardData().subscribe({
      next: (response: any) => {
        this.summary = { ...this.emptySummary(), ...(response.summary || {}) };
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.error = error.error?.message || 'Could not load impact information.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private emptySummary(): ImpactSummary {
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
}
