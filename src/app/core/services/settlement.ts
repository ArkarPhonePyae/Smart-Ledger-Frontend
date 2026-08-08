import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettlementService {
  private http = inject(HttpClient);
  private apiUrl = 'http://smart-ledger-backend-g024.onrender.com/api/settlements';

  settleDebt(payload: { payeeName: string; amount: number }): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

  sendReminder(payload: { payeeName: string; amount: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/remind`, payload);
  }
}