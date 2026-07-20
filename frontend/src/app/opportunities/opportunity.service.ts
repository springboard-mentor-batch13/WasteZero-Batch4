import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Opportunity } from './opportunity.model';

export interface OpportunityFilters {
  status?: string;
  search?: string;
  city?: string;
  page?: number;
  limit?: number;
}

export interface OpportunityPage {
  opportunities: Opportunity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

@Injectable({ providedIn: 'root' })
export class OpportunityService {
  private api = 'http://localhost:5000/api/opportunities';

  constructor(private http: HttpClient) {}

  private paramsFor(filters?: OpportunityFilters) {
    let params = new HttpParams();
    if (filters?.status && filters.status !== 'all') params = params.set('status', filters.status);
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.city && filters.city !== 'all') params = params.set('city', filters.city);
    if (filters?.page) params = params.set('page', filters.page);
    if (filters?.limit) params = params.set('limit', filters.limit);
    return params;
  }

  getAll(filters?: OpportunityFilters): Observable<Opportunity[]> {
    return this.getPage(filters).pipe(map(res => res.opportunities));
  }

  getPage(filters?: OpportunityFilters): Observable<OpportunityPage> {
    const params = this.paramsFor(filters);
    return this.http.get<Opportunity[] | OpportunityPage>(this.api, { params }).pipe(
      map(res => Array.isArray(res)
        ? {
            opportunities: res,
            pagination: {
              page: 1,
              limit: res.length || 20,
              total: res.length,
              pages: 1,
            },
          }
        : res),
    );
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
