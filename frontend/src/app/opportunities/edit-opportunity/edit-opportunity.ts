import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OpportunityService } from '../opportunity.service';
import { Opportunity } from '../opportunity.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-opportunity',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-opportunity.html',
  styleUrl: './edit-opportunity.css',
})
export class EditOpportunity implements OnInit {

  // 1. Give it default empty values so the HTML form doesn't crash while waiting for the database
  opportunity: Opportunity = {
    id: '',
    title: '',
    description: '',
    requiredSkills: [],
    duration: '',
    location: '',
    status: 'Open'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private opportunityService: OpportunityService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.opportunityService.getById(id).subscribe((response: any) => {
        // Just in case the backend wraps it in { data: {...} }
        const data = response.data || response.opportunity || response;

        if (data) {
          // 2. Translate the backend data just like we did in the list
          this.opportunity = {
            ...data,
            id: data._id || data.id,
            requiredSkills: data.required_skills || data.requiredSkills || [],
            duration: data.duration || '',
            location: data.location || '',
            status: data.status || 'Open'
          };
        }
      });
    }
  }

  updateOpportunity() {
    this.opportunityService.update(this.opportunity).subscribe({
      next: () => {
        alert('Opportunity updated successfully!');
        this.router.navigate(['/opportunities']);
      },
      error: (err) => {
        console.error('Failed to update opportunity:', err);
        alert('Failed to update opportunity. Check the console for details.');
      }
    });
  }
}