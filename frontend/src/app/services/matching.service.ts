import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface OpportunityMatch {
  opportunity: any;
  score: number;
  reasons: string[];
}

@Injectable({ providedIn: 'root' })
export class MatchingService {
  private api = 'http://localhost:5000/api/matches';

  constructor(private http: HttpClient) {}

  getSuggestions(): Observable<OpportunityMatch[]> {
    return this.http.get<OpportunityMatch[]>(this.api);
  }
}
