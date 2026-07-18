import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Opportunity } from './opportunity.model';

@Injectable({ providedIn: 'root' })
export class OpportunityService {
  private api = 'http://localhost:5000/api/opportunities';

  constructor(private http: HttpClient) {}

  getAll(filters?: { status?: string; search?: string; city?: string }): Observable<Opportunity[]> {
    let params = new HttpParams();
    if (filters?.status && filters.status !== 'all') params = params.set('status', filters.status);
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.city && filters.city !== 'all') params = params.set('city', filters.city);
    return this.http.get<Opportunity[]>(this.api, { params });
  }

  getById(id: string): Observable<Opportunity> {
    return this.http.get<Opportunity>(`${this.api}/${id}`);
  }

  create(data: any): Observable<Opportunity> {
    return this.http.post<Opportunity>(this.api, data);
  }

  update(id: string, data: any): Observable<Opportunity> {
    return this.http.put<Opportunity>(`${this.api}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

  apply(id: string): Observable<any> {
    return this.http.post(`${this.api}/${id}/apply`, {});
  }

  getMyApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/my-applications`);
  }
}