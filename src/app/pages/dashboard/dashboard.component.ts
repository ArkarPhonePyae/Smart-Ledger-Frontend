import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { LucideAngularModule } from 'lucide-angular';
import { FadeInViewDirective } from '../../shared/directives/fade-in-view.directive';
import { UiStateService } from '../../core/services/ui-state.service';
import { ToastService } from '../../core/services/toast.service';
import { DashboardService } from '../../core/services/dashboard';
import { DashboardSummary } from '../../shared/models/dashboard.model';
import { SettlementService } from '../../core/services/settlement';
import { SettingsService } from '../../core/services/settings.service.ts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FadeInViewDirective],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private router = inject(Router);
  private ui = inject(UiStateService);
  private toast = inject(ToastService);
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);
  private settlementService = inject(SettlementService);
  protected settingsService = inject(SettingsService);

  @ViewChild('dashboardChart') chartCanvas?: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  dashboardData: DashboardSummary | null = null;
  isLoading = true;
  private pendingChartData?: { inflow: number[]; outflow: number[] };

  getCurrencySymbol(): string {
    return this.settingsService.getSymbol();
  }

  formatCompactNumber(value: number | null | undefined): string {
    const num = value ?? 0;
    if (Math.abs(num) >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + ' M';
    }
    if (Math.abs(num) >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, '') + ' k';
    }
    return num.toFixed(2);
  }

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  ngAfterViewInit(): void {
    if (this.pendingChartData && this.chartCanvas) {
      this.initChart(this.pendingChartData.inflow, this.pendingChartData.outflow);
      this.pendingChartData = undefined;
    }
  }

  fetchDashboardData(): void {
    this.isLoading = true;
    this.dashboardService.getDashboardSummary().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;

        this.cdr.markForCheck();
        this.cdr.detectChanges();

        const inflow = data?.inflowChart || [1200, 1900, 1500, 2200, 1800, 2450];
        const outflow = data?.outflowChart || [800, 1100, 950, 1400, 1200, 1420];

        setTimeout(() => {
          if (this.chartCanvas) {
            this.initChart(inflow, outflow);
          } else {
            this.pendingChartData = { inflow, outflow };
          }
          this.cdr.detectChanges();
        }, 100);
      },
      error: (err) => {
        console.error('Detailed Dashboard Error:', err);
        this.toast.show('Failed to load dashboard data', 'error' as any);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  initChart(inflow: number[], outflow: number[]): void {
    if (!this.chartCanvas) return;
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Inflow (' + this.getCurrencySymbol() + ')',
            data: inflow,
            borderColor: '#2563EB',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Outflow (' + this.getCurrencySymbol() + ')',
            data: outflow,
            borderColor: '#22C55E',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { family: 'Inter', size: 11 } } },
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: 'rgba(200, 200, 200, 0.1)' } },
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  openNewExpenseModal(): void {
    this.ui.openNewExpenseModal();
  }

  goTo(view: string): void {
    this.router.navigate(['/', view]);
  }

  settle(name: string): void {
    const amountToSettle = this.dashboardData?.aiInsightAmount ?? 0;

    const isConfirmed = window.confirm(
        `Are you sure you have paid ${this.getCurrencySymbol()}${amountToSettle.toFixed(2)} to ${name}? This will mark the debt as settled.`
    );

    if (!isConfirmed) {
      return;
    }

    const payload = {
      payeeName: name,
      amount: amountToSettle
    };

    this.settlementService.settleDebt(payload).subscribe({
      next: () => {
        this.toast.show(`Successfully settled with ${name}!`, 'success' as any);
        this.dashboardData = null;
        this.isLoading = true;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.fetchDashboardData();
        }, 300);
      },
      error: (err) => {
        console.error('Settlement error:', err);
        this.toast.show('Failed to process settlement', 'error' as any);
      }
    });
  }

  remind(name: string): void {
    const amountToCheck = this.dashboardData?.aiInsightAmount ?? 0;

    if (!name || amountToCheck <= 0) {
      this.toast.show('Invalid reminder details or amount is zero', 'error' as any);
      return;
    }

    const isConfirmed = window.confirm(
        `Send a payment reminder notification to ${name} for ${this.getCurrencySymbol()}${amountToCheck.toFixed(2)}?`
    );

    if (!isConfirmed) {
      return;
    }

    const payload = {
      payeeName: name,
      amount: amountToCheck
    };

    this.settlementService.sendReminder(payload).subscribe({
      next: () => {
        this.toast.show(`Reminder sent successfully to ${name}!`, 'success' as any);
      },
      error: (err) => {
        console.error('Reminder error:', err);
        this.toast.show('Failed to send reminder', 'error' as any);
      }
    });
  }

}