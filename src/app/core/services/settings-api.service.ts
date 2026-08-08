import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface BillingResponse {
  isProMember: boolean;
  planName: string;
  price: number;
  renewalDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsApiService {
  private http = inject(HttpClient);
  private apiUrl = '/api/settings';
  private billingApiUrl = '/api/billing';

  changePassword(data: any): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/password`, data);
  }

  getBillingInfo(): Observable<ApiResponse<BillingResponse>> {
    return this.http.get<ApiResponse<BillingResponse>>(`${this.apiUrl}/billing`);
  }

  upgradeToPro(): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/upgrade-pro`, {});
  }

  createCheckoutSession(): Observable<ApiResponse<{ checkoutUrl: string }>> {
    return this.http.post<ApiResponse<{ checkoutUrl: string }>>(`${this.billingApiUrl}/create-checkout-session`, {});
  }
}