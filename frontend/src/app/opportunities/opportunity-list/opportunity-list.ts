import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Opportunity } from '../opportunity.model';
import { OpportunityService } from '../opportunity.service';

@Component({
  selector: 'app-opportunity-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './opportunity-list.html',
  styleUrl: './opportunity-list.css',
})
export class OpportunityList {

  opportunities: Opportunity[] = [];

  constructor(private opportunityService: OpportunityService) {
    this.opportunities = this.opportunityService.getAll();
  }

  deleteOpportunity(id: number) {

  const ok = confirm('Are you sure you want to delete this opportunity?');

  if (!ok) {
    return;
  }

  this.opportunityService.delete(id);
  this.opportunities = this.opportunityService.getAll();
}
}