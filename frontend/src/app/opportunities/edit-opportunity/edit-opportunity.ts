import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OpportunityService } from '../opportunity.service';

@Component({
  selector: 'app-edit-opportunity',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-opportunity.html',
  styleUrl: './edit-opportunity.css',
})
export class EditOpportunity implements OnInit {
  form: FormGroup;
  loading = false;
  fetching = true;
  error = '';
  id = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private opportunityService: OpportunityService,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      required_skills: [''],
      duration: [''],
      location: ['', Validators.required],
      date: [''],
      image_url: [''],
      status: ['open'],
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.opportunityService.getById(this.id).subscribe({
      next: (opp) => {
        this.form.patchValue({
          title: opp.title,
          description: opp.description,
          required_skills: (opp.required_skills || []).join(', '),
          duration: opp.duration || '',
          location: opp.location || '',
          date: opp.date ? opp.date.slice(0, 10) : '',
          image_url: opp.image_url || '',
          status: opp.status,
        });
        this.fetching = false;
      },
      error: () => { this.error = 'Failed to load opportunity'; this.fetching = false; },
    });
  }

  updateOpportunity() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    const val = this.form.value;
    const payload = {
      ...val,
      required_skills: val.required_skills
        ? val.required_skills.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [],
    };

    this.opportunityService.update(this.id, payload).subscribe({
      next: () => this.router.navigate(['/opportunities']),
      error: (err) => {
        this.error = err.error?.message || 'Failed to update opportunity';
        this.loading = false;
      },
    });
  }
}