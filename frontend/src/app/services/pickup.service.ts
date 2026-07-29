import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Pickup {
  _id: string;
  user_id: any;
  assigned_to?: any;
  waste_type: string;
  quantity_kg: number;
  pickup_date: string;
  time_slot: string;
  address: string;
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class PickupService {
  private api = 'http://localhost:5000/api/pickups';

  constructor(private http: HttpClient) {}

  getAll(status = 'all'): Observable<Pickup[]> {
    const params = status === 'all' ? undefined : new HttpParams().set('status', status);
    return this.http.get<Pickup[]>(this.api, { params });
  }

  create(data: any): Observable<Pickup> {
    return this.http.post<Pickup>(this.api, data);
  }

  updateStatus(id: string, status: Pickup['status']): Observable<Pickup> {
    return this.http.patch<Pickup>(`${this.api}/${id}/status`, { status });
  }

  cancel(id: string): Observable<Pickup> {
    return this.http.patch<Pickup>(`${this.api}/${id}/cancel`, {});
  }
}
