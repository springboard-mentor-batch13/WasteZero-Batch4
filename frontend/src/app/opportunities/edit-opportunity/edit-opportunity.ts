import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  selectedFile: File | null = null;
  currentImageUrl = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private opportunityService: OpportunityService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      required_skills: [''],
      duration: [''],
      location: ['', Validators.required],
      date: [''],
      status: ['open'],
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.opportunityService.getById(this.id).subscribe({
      next: (opp) => {
        this.currentImageUrl = opp.image_url || '';
        this.form.patchValue({
          title: opp.title,
          description: opp.description,
          required_skills: (opp.required_skills || []).join(', '),
          duration: opp.duration || '',
          location: opp.location || '',
          date: opp.date ? opp.date.slice(0, 10) : '',
          status: opp.status,
        });
        this.fetching = false;
        this.cdr.detectChanges(); 
      },
      error: () => {
        this.error = 'Failed to load opportunity';
        this.fetching = false;
        this.cdr.detectChanges();
      },
    });
  }

  updateOpportunity() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    const val = this.form.value;
    const formData = new FormData();

    formData.append('title', val.title || '');
    formData.append('description', val.description || '');
    formData.append('location', val.location || '');
    formData.append('duration', val.duration || '');
    formData.append('date', val.date || '');
    formData.append('status', val.status || '');
    formData.append(
      'required_skills',
      JSON.stringify(
        val.required_skills
          ? val.required_skills.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [],
      ),
    );

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.opportunityService.update(this.id, formData).subscribe({
      next: () => {
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/opportunities']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update opportunity';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}