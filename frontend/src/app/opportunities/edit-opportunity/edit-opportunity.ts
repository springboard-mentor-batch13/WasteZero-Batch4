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

  opportunity!: Opportunity;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private opportunityService: OpportunityService
  ) {}

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    const data = this.opportunityService.getById(id);

    if (data) {
      this.opportunity = {
        ...data,
        requiredSkills: [...data.requiredSkills]
      };
    }
  }

  updateOpportunity() {

    this.opportunityService.update(this.opportunity);

    alert('Opportunity updated successfully!');

    this.router.navigate(['/opportunities']);
  }

}