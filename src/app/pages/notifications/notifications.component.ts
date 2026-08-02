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

  markAsRead(id: string): void {
    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        this.loadNotifications();
      }
    });
  }

  deleteNotification(id: string): void {
    this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        this.toast.show('Notification deleted', 'success' as any);
        this.loadNotifications();
      }
    });
  }

  clearAll(): void {
    this.notificationService.clearAllNotifications().subscribe({
      next: () => {
        this.toast.show('All notifications cleared', 'success' as any);
        this.loadNotifications();
      }
    });
  }
}