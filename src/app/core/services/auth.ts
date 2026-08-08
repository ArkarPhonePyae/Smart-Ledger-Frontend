import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'http://smart-ledger-backend-g024.onrender.com/api/auth';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
        map(response => response.data ? response.data : response)
    );
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user).pipe(
        map(response => response.data ? response.data : response)
    );
  }

  verifyOtp(data: { email: string; otp: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify-otp`, data).pipe(
        map(response => response.data ? response.data : response)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && token !== 'undefined' && token !== 'null';
  }
}