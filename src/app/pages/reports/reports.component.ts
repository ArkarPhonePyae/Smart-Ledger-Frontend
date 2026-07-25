import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FadeInViewDirective } from '../../shared/directives/fade-in-view.directive';

interface CategoryShare {
  label: string;
  percent: number;
  barClass: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FadeInViewDirective],
  templateUrl: './reports.component.html',
})
export class ReportsComponent {
  readonly categoryShares: CategoryShare[] = [
    { label: 'Food & Dining', percent: 45, barClass: 'bg-primary' },
    { label: 'Travel & Flights', percent: 30, barClass: 'bg-indigo-500' },
    { label: 'Bills & Utilities', percent: 25, barClass: 'bg-success' },
  ];
}
