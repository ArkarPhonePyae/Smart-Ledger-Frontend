import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FadeInViewDirective } from '../../shared/directives/fade-in-view.directive';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../core/services/toast.service';

interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, FormsModule, FadeInViewDirective],
  templateUrl: './help.component.html',
})
export class HelpComponent implements OnInit {
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  faqs: FaqItem[] = [];
  searchQuery = '';
  isSubmitting = false;

  supportForm = {
    email: '',
    subject: '',
    message: ''
  };

  ngOnInit(): void {
    this.fetchFaqs();
  }

  fetchFaqs(): void {
    this.http.get<FaqItem[]>('/api/help/faqs').subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.faqs = data;
        } else {
          // Fallback default FAQs if backend is empty
          this.faqs = [
            {
              question: 'How does AI Debt Simplification work?',
              answer: 'AuraPay analyzes mutual debts across your groups and calculates the minimum number of transactions required to settle all balances completely.',
            },
            {
              question: 'Are my financial records secure?',
              answer: 'Yes, all records are encrypted using enterprise-grade protocols with secure token authentication.',
            },
          ];
        }
      },
      error: () => {
        this.faqs = [
          {
            question: 'How does AI Debt Simplification work?',
            answer: 'AuraPay analyzes mutual debts across your groups and calculates the minimum number of transactions required to settle all balances completely.',
          },
        ];
      }
    });
  }

  get filteredFaqs(): FaqItem[] {
    const query = (this.searchQuery || '').trim().toLowerCase();
    if (!query) {
      return this.faqs;
    }
    return this.faqs.filter(
        f => f.question.toLowerCase().includes(query) || f.answer.toLowerCase().includes(query)
    );
  }

  submitSupport(event: Event): void {
    event.preventDefault();
    if (!this.supportForm.email || !this.supportForm.subject || !this.supportForm.message) {
      this.toast.show('Please fill in all support fields', 'error' as any);
      return;
    }

    this.isSubmitting = true;
    this.http.post('/api/help/support', this.supportForm).subscribe({
      next: () => {
        this.toast.show('Support ticket sent successfully!', 'success' as any);
        this.supportForm = { email: '', subject: '', message: '' };
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Support submission error:', err);
        this.toast.show('Failed to submit support ticket', 'error' as any);
        this.isSubmitting = false;
      }
    });
  }
}