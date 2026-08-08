import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = 'http://smart-ledger-backend-g024.onrender.com/api/notifications';

  private unreadCountSource = new BehaviorSubject<boolean>(false);
  unread$ = this.unreadCountSource.asObservable();

  getNotifications(): Observable<NotificationItem[]> {
    return this.http.get<NotificationItem[]>(this.apiUrl).pipe(
        tap(notifications => {
          const hasUnread = notifications.some(n => !n.isRead);
          this.unreadCountSource.next(hasUnread);
        })
    );
  }

  markAsRead(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/read/${id}`, {}, { responseType: 'text' }).pipe(
        tap(() => {
          // တစ်ခုခုကို Read လိုက်တာနဲ့ API ပြီးတာနဲ့ Notification စာရင်းကို အသစ်ပြန်စစ်ရန် (သို့မဟုတ် unread ကို ချက်ချင်း false ဖြစ်ရန်)
          this.checkAndUpdateUnreadStatus();
        })
    );
  }

  // လက်ရှိ အခြေအနေကို အမြဲဆွဲစစ်ပေးမည့် helper method
  checkAndUpdateUnreadStatus(): void {
    this.getNotifications().subscribe();
  }

  deleteNotification(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
        tap(() => this.checkAndUpdateUnreadStatus())
    );
  }

  clearAllNotifications(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear-all`).pipe(
        tap(() => this.unreadCountSource.next(false))
    );
  }
}