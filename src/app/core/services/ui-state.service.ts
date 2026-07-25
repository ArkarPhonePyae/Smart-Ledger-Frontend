import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiStateService {
  // Desktop collapsible sidebar
  readonly isSidebarCollapsed = signal(false);

  // Mobile responsive drawer
  readonly isMobileDrawerOpen = signal(false);

  // User profile dropdown menu
  readonly isUserDropdownOpen = signal(false);

  // Command palette (Ctrl/Cmd + K)
  readonly isCommandPaletteOpen = signal(false);

  // New expense modal
  readonly isNewExpenseModalOpen = signal(false);

  toggleSidebarCollapse(): void {
    this.isSidebarCollapsed.update((v) => !v);
  }

  toggleMobileDrawer(): void {
    this.isMobileDrawerOpen.update((v) => !v);
  }

  closeMobileDrawer(): void {
    this.isMobileDrawerOpen.set(false);
  }

  toggleUserDropdown(): void {
    this.isUserDropdownOpen.update((v) => !v);
  }

  closeUserDropdown(): void {
    this.isUserDropdownOpen.set(false);
  }

  openCommandPalette(): void {
    this.isCommandPaletteOpen.set(true);
  }

  closeCommandPalette(): void {
    this.isCommandPaletteOpen.set(false);
  }

  openNewExpenseModal(): void {
    this.isNewExpenseModalOpen.set(true);
  }

  closeNewExpenseModal(): void {
    this.isNewExpenseModalOpen.set(false);
  }
}
