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

  updateStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.api}/${id}/status`, { status });
  }

  getCandidates(pickupId: string): Observable<any> {
    return this.http.get(`${this.api}/${pickupId}/candidates`);
  }

  offerPickup(pickupId: string, volunteerId: string): Observable<any> {
    return this.http.patch(`${this.api}/${pickupId}/offer`, { volunteerId });
  }
  respondToOffer(pickupId: string, accept: boolean): Observable<any> {
    return this.http.patch(`${this.api}/${pickupId}/respond`, { accept });
  }
}