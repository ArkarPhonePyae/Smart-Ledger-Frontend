import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FadeInViewDirective } from '../../shared/directives/fade-in-view.directive';
import { NotificationService, NotificationItem } from '../../core/services/notification';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FadeInViewDirective],
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {
  private notificationService = inject(NotificationService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  notifications: NotificationItem[] = [];
  isLoading = true;

  // Modal အတွက် variable အသစ်
  selectedNotification: NotificationItem | null = null;

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  // ဝင်ကြည့်လိုက်တာနဲ့ Detail ပေါ်လာပြီး Unread ဖြစ်နေရင် Read အဖြစ်သို့ ပြောင်းပေးခြင်း
  openNotificationDetail(notification: NotificationItem): void {
    this.selectedNotification = notification;

    if (!notification.isRead) {
      this.markAsRead(notification.id);
    }
  }

  closeModal(): void {
    this.selectedNotification = null;
  }

  markAsRead(id: string): void {
    console.log('1. Mark as read initiated for ID:', id);

    this.notificationService.markAsRead(id).subscribe({
      next: (res) => {
        console.log('2. API Success response:', res);

        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
          notification.isRead = true;
        }

        // Selected notification ကိုပါ update လုပ်ပေးရန်
        if (this.selectedNotification && this.selectedNotification.id === id) {
          this.selectedNotification.isRead = true;
        }

        this.cdr.detectChanges();

        this.toast.show('Marked as read', 'success' as any);
      },
      error: (err) => {
        console.error('3. API Error encountered:', err);
      }
    });
  }

  deleteNotification(id: string): void {
    this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        this.toast.show('Notification deleted', 'success' as any);
        if (this.selectedNotification?.id === id) {
          this.closeModal();
        }
        this.loadNotifications();
      }
    });
  }

  clearAll(): void {
    this.notificationService.clearAllNotifications().subscribe({
      next: () => {
        this.toast.show('All notifications cleared', 'success' as any);
        this.closeModal();
        this.loadNotifications();
      }
    });
  }
}