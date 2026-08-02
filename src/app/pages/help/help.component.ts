import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FadeInViewDirective } from '../../shared/directives/fade-in-view.directive';

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, FadeInViewDirective],
  templateUrl: './help.component.html',
})
export class HelpComponent {
  readonly faqs: FaqItem[] = [
    {
      question: 'How does AI Debt Simplification work?',
      answer:
        'AuraPay analyzes mutual debts across your groups and calculates the minimum number of transactions required to settle all balances completely.',
    },
    {
      question: 'Are my financial records secure?',
      answer:
        'Yes, all records are encrypted using enterprise-grade protocols with secure token authentication.',
    },
  ];
}
