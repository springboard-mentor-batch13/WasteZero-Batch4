import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Match {
  title: string;
  organization: string;
  location: string;
  description: string;
  percentage: number;
}

@Component({
  selector: 'app-match-suggestions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './match-suggestions.html',
  styleUrl: './match-suggestions.css',
})
export class MatchSuggestions {

  matches: Match[] = [
    {
      title: 'Plastic Cleanup Drive',
      organization: 'Green Earth NGO',
      location: 'Hyderabad',
      description: 'Help collect and recycle plastic waste in local communities.',
      percentage: 95
    },
    {
      title: 'Tree Plantation Campaign',
      organization: 'Eco Club',
      location: 'Visakhapatnam',
      description: 'Join volunteers planting trees across the city.',
      percentage: 89
    },
    {
      title: 'Beach Cleanup',
      organization: 'Blue Ocean Foundation',
      location: 'Vizag',
      description: 'Participate in cleaning beaches and protecting marine life.',
      percentage: 84
    }
  ];

}