import { Injectable, signal } from '@angular/core';
import { Expense } from '../../shared/models/expense.model';

@Injectable({ providedIn: 'root' })
export class ExpenseStoreService {
  private nextId = 3;

  readonly expenses = signal<Expense[]>([
    {
      id: 1,
      emoji: '💡',
      iconBg: 'bg-indigo-500/10',
      iconColor: 'text-indigo-500',
      title: 'Monthly Electricity Bill',
      subtitle: 'Paid by Alex • Split Equally (4 people)',
      amount: '+$85.20',
      amountClass: 'text-emerald-500',
    },
    {
      id: 2,
      emoji: '🍣',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      title: 'Sushi Dinner at Ginza',
      subtitle: 'Food • Paid by Alex • Split (3 people)',
      amount: '+$124.00',
      amountClass: 'text-emerald-500',
    },
  ]);

  addExpense(description: string, amount: string): void {
    const expense: Expense = {
      id: this.nextId++,
      emoji: '💸',
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
      title: description || 'New Expense',
      subtitle: 'Paid by Alex • Just now',
      amount: `+$${amount || '50.00'}`,
      amountClass: 'text-success',
    };
    this.expenses.update((list) => [expense, ...list]);
  }
}
