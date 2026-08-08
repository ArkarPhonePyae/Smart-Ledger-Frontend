import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FadeInViewDirective } from '../../shared/directives/fade-in-view.directive';
import { ToastService } from '../../core/services/toast.service';
import { SettingsService } from '../../core/services/settings.service.ts';
import { SecuritySettingsComponent } from '../../features/settings/security-settings/security-settings';
import { BillingSettingsComponent } from '../../features/settings/billing-settings/billing-settings';

type SettingsTab = 'General' | 'Security' | 'Billing';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FadeInViewDirective,
    SecuritySettingsComponent,
    BillingSettingsComponent
  ],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  private toast = inject(ToastService);
  protected settingsService = inject(SettingsService);

  readonly tabs: SettingsTab[] = ['General', 'Security', 'Billing'];
  activeTab: SettingsTab = 'General';

  selectedCurrency = this.settingsService.currency;

  setTab(tab: SettingsTab): void {
    this.activeTab = tab;
  }

  onCurrencyChange(curr: string): void {
    this.settingsService.setCurrency(curr);
    this.toast.show('Currency updated successfully', 'success' as any);
  }

  confirmDelete(): void {
    this.toast.show('Confirmation required for account deletion', 'warning' as any);
  }
}