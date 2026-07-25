import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FadeInViewDirective } from '../../shared/directives/fade-in-view.directive';
import { ToastService } from '../../core/services/toast.service';

type SettingsTab = 'General' | 'Security' | 'Billing';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FadeInViewDirective],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  private toast = inject(ToastService);

  readonly tabs: SettingsTab[] = ['General', 'Security', 'Billing'];
  activeTab: SettingsTab = 'General';

  setTab(tab: SettingsTab): void {
    this.activeTab = tab;
  }

  confirmDelete(): void {
    this.toast.show('Confirmation required for account deletion', 'warning');
  }
}
