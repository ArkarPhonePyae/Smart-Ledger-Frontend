import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl: string;
  role: string;
  proMember: boolean;
  darkMode: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://smart-ledger-backend-g024.onrender.com/api/users/profile';

  getProfile(): Observable<{ success: boolean; data: UserProfile }> {
    return this.http.get<{ success: boolean; data: UserProfile }>(this.apiUrl);
  }

  updateProfile(data: Partial<UserProfile>): Observable<{ success: boolean; data: UserProfile }> {
    return this.http.put<{ success: boolean; data: UserProfile }>(this.apiUrl, data);
  }

  getProfileById(id: string): Observable<{ success: boolean; data: UserProfile }> {
    return this.http.get<{ success: boolean; data: UserProfile }>(`http://localhost:8080/api/users/profile/${id}`);
  }
}