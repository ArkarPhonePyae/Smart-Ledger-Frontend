import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { UiStateService } from '../../core/services/ui-state.service';
import { ToastService } from '../../core/services/toast.service';
import { UserService, UserProfile } from '../../core/services/user';

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
export class SidebarComponent implements OnInit {
  private ui = inject(UiStateService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private userService = inject(UserService);

  readonly isCollapsed = this.ui.isSidebarCollapsed;
  readonly isMobileDrawerOpen = this.ui.isMobileDrawerOpen;
  readonly isUserDropdownOpen = this.ui.isUserDropdownOpen;

  // Dynamic user data for sidebar
  currentUser: UserProfile | null = null;

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.userService.getProfile().subscribe({
      next: (res) => {
        this.currentUser = res.data;
      },
      error: (err) => {
        console.error('Failed to load sidebar user profile', err);
      }
    });
  }

  // Helper method: Admin ဟုတ်မဟုတ် အသေအချာ စစ်ဆေးရန်
  isAdmin(): boolean {
    const role = this.currentUser?.role || localStorage.getItem('role');
    return role === 'ROLE_ADMIN' || role === 'ADMIN';
  }

  // 🔤 နာမည်ရဲ့ အက္ခရာအစ (ဥပမာ: "Arkar Phone" ဆိုရင် "AP") ကို ယူပေးမည့် Method
  getInitials(name: string | undefined): string {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  readonly navItems: NavItem[] = [
    { target: 'dashboard', icon: 'layout-dashboard', label: 'Dashboard' },
    { target: 'expenses', icon: 'receipt', label: 'Expenses' },
    { target: 'groups', icon: 'users', label: 'Groups & Splits' },
    { target: 'friends', icon: 'user-check', label: 'Friends' },
    { target: 'reports', icon: 'pie-chart', label: 'Reports & AI' },
    { target: 'admin', icon: 'shield-alert', label: 'Admin Panel', adminOnly: true },
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