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

  @ViewChild('dashboardChart') chartCanvas?: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  dashboardData: DashboardSummary | null = null;
  isLoading = true;
  private pendingChartData?: { inflow: number[]; outflow: number[] };

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
        console.log('Dashboard Data Received:', data);
        this.dashboardData = data;
        this.isLoading = false;

        // အရေးကြီးဆုံး: Change Detection ကို Force လုပ်ခြင်း
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
            label: 'Inflow ($)',
            data: inflow,
            borderColor: '#2563EB',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Outflow ($)',
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
    this.toast.show(`Settlement request sent to ${name}!`, 'success' as any);
  }
}