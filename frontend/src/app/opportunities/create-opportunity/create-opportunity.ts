import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Required for *ngIf
import { Router } from '@angular/router';
import { OpportunityService } from '../opportunity.service';

@Component({
  selector: 'app-create-opportunity',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-opportunity.html',
  styleUrl: './create-opportunity.css',
})
export class CreateOpportunity {

  title = '';
  description = '';
  requiredSkills = '';
  duration = '';
  location = '';
  imageUrl: string = '';

  constructor(
    private opportunityService: OpportunityService,
    private router: Router
  ) {}

  
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  createOpportunity() {
    const newOpportunity = {
      title: this.title,
      description: this.description,
      requiredSkills: this.requiredSkills.split(','),
      duration: this.duration,
      location: this.location,
      imageUrl: this.imageUrl,
      status: 'Open'
    };

    this.opportunityService.create(newOpportunity).subscribe({
      next: () => {
        alert('Opportunity created successfully!');
        this.router.navigate(['/opportunities']);
      },
      error: (err: any) => console.error('Error saving:', err)
    });
  }
}
