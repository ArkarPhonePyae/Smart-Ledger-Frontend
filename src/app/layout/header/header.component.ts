import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { UiStateService } from '../../core/services/ui-state.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private ui = inject(UiStateService);
  private router = inject(Router);
  readonly theme = inject(ThemeService);

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
