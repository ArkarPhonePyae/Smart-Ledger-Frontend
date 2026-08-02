import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { CommandPaletteComponent } from '../../shared/components/command-palette/command-palette.component';
import { NewExpenseModalComponent } from '../../shared/components/new-expense-modal/new-expense-modal.component';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';
import { UiStateService } from '../../core/services/ui-state.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    CommandPaletteComponent,
    NewExpenseModalComponent,
    ToastContainerComponent,
  ],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  private ui = inject(UiStateService);

  // 5. Command Palette (Ctrl + K) / Escape handling — originally on window keydown.
  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.ui.openCommandPalette();
    }
    if (event.key === 'Escape') {
      this.ui.closeCommandPalette();
      this.ui.closeNewExpenseModal();
    }
  }

  // 4. User Dropdown Menu Toggle — originally closes on any window click.
  @HostListener('window:click')
  handleWindowClick(): void {
    this.ui.closeUserDropdown();
  }
}
