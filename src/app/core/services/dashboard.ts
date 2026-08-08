import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DashboardSummary } from '../../shared/models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = 'https://smart-ledger-backend-g024.onrender.com/api/dashboard';

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.http.get<any>(`${`${this.apiUrl}/summary`}`).pipe(
        map(response => {
          return response?.data ? response.data : response;
        })
    );
  }
}