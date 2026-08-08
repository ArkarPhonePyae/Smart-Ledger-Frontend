import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { SettingsApiService } from '../../../core/services/settings-api.service';

@Component({
  selector: 'app-security-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="glass-card p-6 rounded-2xl apple-shadow space-y-6 max-w-2xl">
      <div>
        <h3 class="font-bold text-base">Change Password</h3>
        <p class="text-xs text-slate-400 mt-0.5">Ensure your account is using a secure password to stay safe.</p>
      </div>

      <div class="space-y-4 text-sm">
        <div>
          <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Current Password</label>
          <input type="password" [(ngModel)]="currentPassword" placeholder="••••••••"
                 class="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl outline-none border border-transparent focus:border-primary">
        </div>
        <div>
          <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">New Password</label>
          <input type="password" [(ngModel)]="newPassword" placeholder="••••••••"
                 class="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl outline-none border border-transparent focus:border-primary">
        </div>
        <div>
          <label class="block text-xs font-semibold uppercase text-slate-400 mb-1">Confirm New Password</label>
          <input type="password" [(ngModel)]="confirmPassword" placeholder="••••••••"
                 class="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl outline-none border border-transparent focus:border-primary">
        </div>
      </div>

      <div class="pt-2 flex justify-end">
        <button (click)="updatePassword()"
                class="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/25">
          Update Password
        </button>
      </div>
    </div>
  `
})
export class SecuritySettingsComponent {
  private toast = inject(ToastService);
  private settingsApi = inject(SettingsApiService);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  updatePassword(): void {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.toast.show('Please fill in all password fields', 'warning' as any);
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.toast.show('New passwords do not match', 'error' as any);
      return;
    }

    this.settingsApi.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.toast.show('Password updated successfully', 'success' as any);
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        const msg = err.error?.message || 'Failed to update password';
        this.toast.show(msg, 'error' as any);
      }
    });
  }
}