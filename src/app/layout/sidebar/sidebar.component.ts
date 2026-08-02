import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { UiStateService } from '../../core/services/ui-state.service';
import { ToastService } from '../../core/services/toast.service';

interface NavItem {
  target: string;
  icon: string;
  label: string;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private ui = inject(UiStateService);
  private toast = inject(ToastService);
  private router = inject(Router);

  readonly isCollapsed = this.ui.isSidebarCollapsed;
  readonly isMobileDrawerOpen = this.ui.isMobileDrawerOpen;
  readonly isUserDropdownOpen = this.ui.isUserDropdownOpen;

  // လက်ရှိ Login ဝင်ထားသူ၏ Role ကို ဖတ်ယူခြင်း
  readonly userRole = localStorage.getItem('role');

  // Helper method: Admin ဟုတ်မဟုတ် အသေအချာ စစ်ဆေးရန် (ROLE_ADMIN နှင့် ADMIN နှစ်မျိုးလုံးကို လက်ခံရန်)
  isAdmin(): boolean {
    return this.userRole === 'ROLE_ADMIN' || this.userRole === 'ADMIN';
  }

  readonly navItems: NavItem[] = [
    { target: 'dashboard', icon: 'layout-dashboard', label: 'Dashboard' },
    { target: 'expenses', icon: 'receipt', label: 'Expenses' },
    { target: 'groups', icon: 'users', label: 'Groups & Splits' },
    { target: 'friends', icon: 'user-check', label: 'Friends' },
    { target: 'reports', icon: 'pie-chart', label: 'Reports & AI' },
    { target: 'admin', icon: 'shield-alert', label: 'Admin Panel', adminOnly: true }, // Admin သီးသန့်
    { target: 'settings', icon: 'settings', label: 'Settings' },
  ];

  toggleCollapse(): void {
    this.ui.toggleSidebarCollapse();
  }

  closeMobileDrawer(): void {
    this.ui.closeMobileDrawer();
  }

  toggleUserDropdown(event: Event): void {
    event.stopPropagation();
    this.ui.toggleUserDropdown();
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
    this.ui.closeUserDropdown();
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
    this.ui.closeUserDropdown();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.toast.show('Logged out successfully', 'warning');
    this.router.navigate(['/login']);
  }
}