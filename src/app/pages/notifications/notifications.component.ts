import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FadeInViewDirective } from '../../shared/directives/fade-in-view.directive';

interface NotificationItem {
  borderClass: string;
  title: string;
  message: string;
  time: string;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FadeInViewDirective],
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent {
  readonly notifications: NotificationItem[] = [
    {
      borderClass: 'border-primary',
      title: 'Payment Received',
      message: 'Sarah Jenkins settled $120.00 via Bank Transfer.',
      time: '10m ago',
    },
    {
      borderClass: 'border-warning',
      title: 'Upcoming Split Due',
      message: 'Tokyo Trip 2026 expense settlement is due tomorrow.',
      time: '2h ago',
    },
  ];
}
