import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Ensure this is imported for routerLink
import { OpportunityService } from '../opportunity.service';
import { Opportunity } from '../opportunity.model';

@Component({
  selector: 'app-opportunity-list',
  standalone: true,
  imports: [CommonModule, RouterModule], // Make sure these are here
  templateUrl: './opportunity-list.html',
  styleUrl: './opportunity-list.css',
})
export class OpportunityList implements OnInit {
  // 1. Initialize with an empty array
  opportunities: Opportunity[] = [];

  constructor(private opportunityService: OpportunityService) {}

  ngOnInit(): void {
    this.loadOpportunities();
  }

loadOpportunities() {
    this.opportunityService.getAll().subscribe({
      next: (data: any[]) => {
        // This 'map' function ensures every single item has the key 'requiredSkills'
        this.opportunities = data.map(item => ({
          ...item,
          requiredSkills: item.requiredSkills || item.required_skills || []
        }));
        
        console.log('Normalized Data:', this.opportunities);
      },
      error: (err) => console.error('Error fetching:', err)
    });
  }

  deleteOpportunity(id: string | undefined) {
    if (!id) return;
    if (confirm('Are you sure you want to delete?')) {
      this.opportunityService.delete(id).subscribe(() => {
        this.loadOpportunities(); // Refresh the list after delete
      });
    }
  }
}