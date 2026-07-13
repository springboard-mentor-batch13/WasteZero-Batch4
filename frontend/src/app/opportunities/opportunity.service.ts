import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Opportunity } from './opportunity.model';

@Injectable({
  providedIn: 'root'
})
export class OpportunityService {
  // Points to your Node.js backend port and route
  private apiUrl = 'http://localhost:5000/api/opportunities'; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<Opportunity[]> {
    return this.http.get<Opportunity[]>(this.apiUrl);
  }

  // Changed id type from number to string to match MongoDB IDs
  getById(id: string): Observable<Opportunity> {
    return this.http.get<Opportunity>(`${this.apiUrl}/${id}`);
  }

  create(opportunity: Opportunity): Observable<Opportunity> {
    return this.http.post<Opportunity>(this.apiUrl, opportunity);
  }

  update(updated: Opportunity): Observable<Opportunity> {
    return this.http.put<Opportunity>(`${this.apiUrl}/${updated.id}`, updated);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}