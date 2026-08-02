import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthResponse, User } from '../../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'http://localhost:8080/api/auth'; // Spring Boot Backend URL

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    // return နှင့် this ကြားတွင် အစက် (.) အစား space ဖြင့် ပြင်ဆင်ရန်
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
        map(response => {
          // အကယ်၍ response ထဲတွင် data wrapper ပါလာပါက data ကို ဖြုတ်ထုတ်ပေးမည်
          return response.data ? response.data : response;
        })
    );
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
        map(response => (response as any).data ? (response as any).data : response)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Role ပါ တစ်ခါတည်း ရှင်းလင်းရန်
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && token !== 'undefined' && token !== 'null';
  }
}