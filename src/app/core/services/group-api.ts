import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../../shared/models/group';
@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private http = inject(HttpClient);
  private apiUrl = 'https://smart-ledger-backend-g024.onrender.com/api/groups';

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl);
  }

  createGroup(groupData: { name: string; description?: string; memberIds?: string[] }): Observable<Group> {
    return this.http.post<Group>(this.apiUrl, groupData);
  }

  getGroupById(id: string): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${id}`);
  }

  deleteGroup(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  leaveGroup(groupId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${groupId}/leave`, { responseType: 'text' as 'json' });
  }
}