import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OpportunityService } from '../opportunity.service';

@Component({
  selector: 'app-create-opportunity',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-opportunity.html',
  styleUrl: './create-opportunity.css',
})
export class CreateOpportunity {

  title = '';
  description = '';
  requiredSkills = '';
  duration = '';
  location = '';

  constructor(
    private opportunityService: OpportunityService,
    private router: Router
  ) {}

  createOpportunity() {
    this.opportunityService.add({
      id: Date.now(),
      title: this.title,
      description: this.description,
      requiredSkills: this.requiredSkills
        .split(',')
        .map(skill => skill.trim()),
      duration: this.duration,
      location: this.location,
      status: 'Open'
    });

    this.router.navigate(['/opportunities']);
  }
}