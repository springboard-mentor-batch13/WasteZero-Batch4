import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatchingService, OpportunityMatch } from '../services/matching.service';

@Component({
  selector: 'app-match-suggestions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './match-suggestions.html',
  styleUrl: './match-suggestions.css',
})
export class MatchSuggestions implements OnInit {
  matches: OpportunityMatch[] = [];
  loading = true;
  error = '';

  constructor(private matching: MatchingService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.matching.getSuggestions().subscribe({
      next: (matches) => {
        this.matches = matches;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Could not load match suggestions';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
