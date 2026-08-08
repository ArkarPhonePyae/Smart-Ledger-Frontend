import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { UiStateService } from '../../core/services/ui-state.service';
import { ThemeService } from '../../core/services/theme.service';
import { NotificationService } from '../../core/services/notification';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private ui = inject(UiStateService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  readonly theme = inject(ThemeService);


  hasUnreadNotifications = false;
  private unreadSub!: Subscription;

  ngOnInit(): void {
    this.unreadSub = this.notificationService.unread$.subscribe(hasUnread => {
      this.hasUnreadNotifications = hasUnread;
    });

    this.notificationService.checkAndUpdateUnreadStatus();
  }

  ngOnDestroy(): void {
    if (this.unreadSub) {
      this.unreadSub.unsubscribe();
    }
  }

  toggleMobileDrawer(): void {
    this.ui.toggleMobileDrawer();
  }

  openCommandPalette(): void {
    this.ui.openCommandPalette();
  }

  openNewExpenseModal(): void {
    this.ui.openNewExpenseModal();
  }

  goTo(view: string): void {
    this.router.navigate(['/', view]);
  }

  toggleTheme(): void {
    this.theme.toggle();
  }
}