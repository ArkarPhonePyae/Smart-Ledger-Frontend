import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FadeInViewDirective],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private ui = inject(UiStateService);
  private toast = inject(ToastService);

  @ViewChild('dashboardChart') chartCanvas?: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  readonly recentActivity = [
    {
      dotColor: 'bg-emerald-500',
      iconBg: 'bg-indigo-500/10',
      iconColor: 'text-indigo-500',
      emoji: '🍣',
      title: 'Sushi Dinner at Ginza',
      subtitle: 'Food • Paid by Alex Morgan',
      amount: '+$124.00',
      amountClass: 'text-emerald-500',
    },
    {
      dotColor: 'bg-danger',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      emoji: '✈️',
      title: 'Tokyo Flight Tickets',
      subtitle: 'Travel • Paid by Sarah Jenkins',
      amount: '-$450.00',
      amountClass: 'text-danger',
    },
    {
      dotColor: 'bg-primary',
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
      emoji: '💡',
      title: 'Monthly Utility Bill Settled',
      subtitle: 'Bills • Automated AI Settlement',
      amount: '+$85.20',
      amountClass: 'text-primary',
    },
  ];

  ngAfterViewInit(): void {
    if (!this.chartCanvas) return;
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Inflow ($)',
            data: [1200, 1900, 1500, 2200, 1800, 2450],
            borderColor: '#2563EB',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Outflow ($)',
            data: [800, 1100, 950, 1400, 1200, 1420],
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
    this.toast.show(`Settlement request sent to ${name}!`, 'success');
  }
}
