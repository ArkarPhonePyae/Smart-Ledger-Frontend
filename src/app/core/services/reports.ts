import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CategoryShare {
  label: string;
  percent: number;
  barClass: string;
}

export interface AiInsight {
  payeeName: string;
  insightText: string;
  amount: number;
}

export interface ReportsResponse {
  healthScore: number;
  healthStatus: string;
  scoreBadge: string;
  aiSummary: string;
  categoryShares: CategoryShare[];
  aiInsights: AiInsight[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = 'http://smart-ledger-backend-g024.onrender.com/api/reports';

  constructor(private http: HttpClient) {}

  getReportsData(): Observable<ReportsResponse> {
    return this.http.get<ReportsResponse>(this.apiUrl);
  }
}