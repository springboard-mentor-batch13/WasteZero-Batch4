import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_BASE } from './api.config';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private api = `${API_BASE}/admin`;
  constructor(private http: HttpClient) {}
  getOverview() { return this.http.get<any>(`${this.api}/overview`); }
  getActivity() { return this.http.get<any>(`${this.api}/activity`); }
  getUsers(filters: { search?: string; role?: string; status?: string }) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => { if (value) params = params.set(key, value); });
    return this.http.get<any>(`${this.api}/users`, { params });
  }
  updateUser(id: string, update: { role?: string; isActive?: boolean }) {
    return this.http.patch<any>(`${this.api}/users/${id}`, update);
  }
  downloadPerformanceReport() {
    return this.http.get(`${this.api}/reports/performance.csv`, {
      observe: 'response',
      responseType: 'blob',
    });
  }
}
