import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PickupService {
  private http = inject(HttpClient);
  private api = 'http://localhost:5000/api/pickups';

  getPickups(): Observable<any> {
    return this.http.get(this.api);
  }

  createPickup(payload: any): Observable<any> {
    return this.http.post(this.api, payload);
  }

  // status: 'scheduled' | 'assigned' | 'completed' | 'cancelled'.
  // volunteerId is required when status === 'assigned' - a pickup can only
  // be assigned to a specific volunteer, never self-assigned by an NGO/admin.
  updateStatus(id: string, status: string, volunteerId?: string): Observable<any> {
    const body: any = { status };
    if (volunteerId) body.assigned_to = volunteerId;
    return this.http.patch(`${this.api}/${id}/status`, body);
  }

  // Volunteers ranked by waste-type match + location text match, for the
  // "assign to volunteer" picker.
  getCandidates(pickupId: string): Observable<any> {
    return this.http.get(`${this.api}/${pickupId}/candidates`);
  }
}