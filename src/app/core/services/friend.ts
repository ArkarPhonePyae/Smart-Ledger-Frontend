import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Friend {
  id?: string;
  friendUserId?: string;
  friendName: string;
  friendEmail: string;
  avatarUrl?: string;
  status: string;
  balanceStatus: string;
  balanceAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/friends';

  getFriends(): Observable<Friend[]> {
    return this.http.get<Friend[]>(this.apiUrl);
  }

  sendFriendRequest(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/request`, { email });
  }

  acceptRequest(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/accept/${id}`, {});
  }

  removeFriend(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}