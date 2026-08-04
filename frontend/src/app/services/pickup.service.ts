import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE } from './api.config';

@Injectable({ providedIn: 'root' })
export class PickupService {
  private http = inject(HttpClient);
  private api = `${API_BASE}/pickups`;

  getPickups(): Observable<any> {
    return this.http.get(this.api);
  }

  createPickup(payload: any): Observable<any> {
    return this.http.post(this.api, payload);
  }

  updateStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.api}/${id}/status`, { status });
  }

  // NGO accepts an unclaimed pickup created by a volunteer.
  acceptPickup(pickupId: string): Observable<any> {
    return this.http.patch(`${this.api}/${pickupId}/accept`, {});
  }

  // NGO rejects it - stays available for other NGOs.
  rejectPickup(pickupId: string): Observable<any> {
    return this.http.patch(`${this.api}/${pickupId}/reject`, {});
  }
}
