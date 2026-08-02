import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiStateService {
  readonly isSidebarCollapsed = signal(false);
  readonly isMobileDrawerOpen = signal(false);
  readonly isUserDropdownOpen = signal(false);
  readonly isCommandPaletteOpen = signal(false);

  readonly isNewExpenseModalOpen = signal(false);
  readonly editingExpense = signal<any | null>(null);

  // 👈 List ကို ချက်ချင်း refresh လုပ်ပေးမည့် callback function
  private refreshCallback: (() => void) | null = null;

  setRefreshCallback(callback: () => void): void {
    this.refreshCallback = callback;
  }

  triggerRefresh(): void {
    if (this.refreshCallback) {
      this.refreshCallback();
    }
  }

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
    this.editingExpense.set(null);
    this.isNewExpenseModalOpen.set(true);
  }

  openEditExpenseModal(expense: any): void {
    this.editingExpense.set(expense);
    this.isNewExpenseModalOpen.set(true);
  }

  closeNewExpenseModal(): void {
    this.isNewExpenseModalOpen.set(false);
    this.editingExpense.set(null);
  }
}