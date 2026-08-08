import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FadeInViewDirective } from '../../shared/directives/fade-in-view.directive';
import { ReportsService, ReportsResponse } from '../../core/services/reports';
import { SettlementService } from '../../core/services/settlement';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FadeInViewDirective],
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {
  private reportsService = inject(ReportsService);
  private settlementService = inject(SettlementService);
  private toast = inject(ToastService);

  reportsData: ReportsResponse | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.fetchReports();
  }

  fetchReports(): void {
    this.isLoading = true;
    this.reportsService.getReportsData().subscribe({
      next: (data) => {
        this.reportsData = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching reports:', err);
        this.isLoading = false;
      }
    });
  }

  settle(name: string, amount: number): void {
    // 🟢 အငြင်းပွားမှု မဖြစ်စေရန် အတည်ပြုချက် (Confirmation) တောင်းခံခြင်း
    const isConfirmed = window.confirm(
        `Are you sure you have paid $${amount.toFixed(2)} to ${name}? This will settle the debt.`
    );

    if (!isConfirmed) {
      return; // မသေချာသေးရင် ရပ်တန့်မည်
    }

    const payload = {
      payeeName: name,
      amount: amount
    };

    this.settlementService.settleDebt(payload).subscribe({
      next: () => {
        this.toast.show(`Successfully settled with ${name}!`, 'success' as any);
        this.fetchReports(); // Refresh data
      },
      error: (err) => {
        console.error('Settlement error:', err);
        this.toast.show('Failed to process settlement', 'error' as any);
      }
    });
  }
  // 🟢 Category တစ်ခုချင်းစီအတွက် လှပသော အရောင်များ အလှည့်ကျထုတ်ပေးရန်
  getCategoryColor(index: number): string {
    const colors = [
      '#6366f1', // Indigo
      '#3b82f6', // Blue
      '#10b981', // Emerald
      '#f59e0b', // Amber
      '#ec4899', // Pink
      '#8b5cf6'  // Purple
    ];
    return colors[index % colors.length];
  }

}