import { Component, ChangeDetectorRef } from '@angular/core';
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
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private opportunityService: OpportunityService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      required_skills: [''],
      duration: [''],
      location: ['', Validators.required],
      date: [''],
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  createOpportunity() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    const val = this.form.value;
    const formData = new FormData();

    formData.append('title', val.title);
    formData.append('description', val.description);
    formData.append('location', val.location);
    formData.append('duration', val.duration || '');
    formData.append('date', val.date || '');

    formData.append(
      'required_skills',
      JSON.stringify(
        val.required_skills
          ? val.required_skills
              .split(',')
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [],
      ),
    );

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.opportunityService.create(formData).subscribe({
      next: () => {
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/opportunities']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create opportunity';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
