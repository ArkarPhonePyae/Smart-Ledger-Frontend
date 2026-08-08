import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';
import { SettingsApiService } from '../../../core/services/settings-api.service';

@Component({
  selector: 'app-billing-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './billing-settings.html',
  styleUrls: ['./billing-settings.scss']
})
export class BillingSettingsComponent implements OnInit {
  private toast = inject(ToastService);
  private settingsApi = inject(SettingsApiService);

  isPro = false;
  planName = 'Free Tier';
  renewalDate = 'N/A';

  ngOnInit(): void {
    this.loadBilling();
  }

  loadBilling(): void {
    this.settingsApi.getBillingInfo().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const res = response.data;
          this.isPro = res.isProMember;
          this.planName = res.planName;
          this.renewalDate = res.renewalDate;
        }
      },
      error: () => {
        this.toast.show('Failed to load billing details', 'error' as any);
      }
    });
  }

  upgrade(): void {
    this.settingsApi.createCheckoutSession().subscribe({
      next: (response) => {
        if (response.success && response.data && response.data.checkoutUrl) {
          window.location.href = response.data.checkoutUrl;
        } else {
          this.toast.show('Failed to redirect to checkout', 'error' as any);
        }
      },
      error: () => {
        this.toast.show('Failed to initiate payment session', 'error' as any);
      }
    });
  }
}