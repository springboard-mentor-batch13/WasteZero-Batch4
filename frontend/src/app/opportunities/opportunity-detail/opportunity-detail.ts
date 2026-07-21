import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OpportunityService } from '../opportunity.service';
import { Opportunity } from '../opportunity.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-opportunity-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
        if (this.isVolunteer) {
          this.opportunityService.getMyApplications().subscribe({
            next: (apps: any[]) => {
              this.applied = apps.some((app) => {
                const oppId = typeof app.opportunity_id === 'object' ? app.opportunity_id._id : app.opportunity_id;
                return oppId === id;
              });
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
