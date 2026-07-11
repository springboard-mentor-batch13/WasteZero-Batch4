import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OpportunityService } from '../opportunity.service';

@Component({
  selector: 'app-create-opportunity',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-opportunity.html',
  styleUrl: './create-opportunity.css',
})
export class CreateOpportunity {
  form: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private opportunityService: OpportunityService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      required_skills: [''],
      duration: [''],
      location: ['', Validators.required],
      date: [''],
      image_url: [''],
    });
  }

  createOpportunity() {
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

    this.opportunityService.create(payload).subscribe({
      next: () => this.router.navigate(['/opportunities']),
      error: (err) => {
        this.error = err.error?.message || 'Failed to create opportunity';
        this.loading = false;
      },
    });
  }
}