import { Injectable } from '@angular/core';
import { Opportunity } from './opportunity.model';

@Injectable({
  providedIn: 'root'
})
export class OpportunityService {

  private opportunities: Opportunity[] = [
    {
      id: 1,
      title: 'Plastic Cleanup Drive',
      description: 'Help clean plastic waste from nearby parks.',
      requiredSkills: ['Teamwork', 'Cleaning'],
      duration: '3 Hours',
      location: 'Dehradun',
      status: 'Open'
    },
    {
      id: 2,
      title: 'E-Waste Collection',
      description: 'Collect electronic waste from residential areas.',
      requiredSkills: ['Communication'],
      duration: '5 Hours',
      location: 'Haridwar',
      status: 'Open'
    }
  ];

  getAll(): Opportunity[] {
    return this.opportunities;
  }

  getById(id: number): Opportunity | undefined {
    return this.opportunities.find(o => o.id === id);
  }

  add(opportunity: Opportunity): void {
    this.opportunities.push(opportunity);
  }

  update(updated: Opportunity): void {
    const index = this.opportunities.findIndex(o => o.id === updated.id);

    if (index !== -1) {
      this.opportunities[index] = updated;
    }
  }

  delete(id: number): void {
    this.opportunities = this.opportunities.filter(o => o.id !== id);
  }
}