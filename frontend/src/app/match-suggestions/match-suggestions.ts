import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-match-suggestions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './match-suggestions.html',
  styleUrl: './match-suggestions.css',
})
export class MatchSuggestions implements OnInit {
  matches: any[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    if (this.auth.getUser()?.role !== 'volunteer') return;

    this.http.get<any>('http://localhost:5000/api/communication/matches').subscribe({
      next: (res) => { this.matches = res.data || []; this.loading = false; },
      error: (err) => { this.error = err.error?.message || 'Failed to load matches'; this.loading = false; }
    });
  }
}