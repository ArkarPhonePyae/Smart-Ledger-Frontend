import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { FadeInViewDirective } from '../../shared/directives/fade-in-view.directive';
import { UiStateService } from '../../core/services/ui-state.service';
import { ToastService } from '../../core/services/toast.service';
import { ExpenseApi } from '../../core/services/expense-api';
import { SettingsService } from '../../core/services/settings.service.ts';
import { Expense } from '../../shared/models/expense.model';
import { NewExpenseModalComponent } from '../../shared/components/new-expense-modal/new-expense-modal.component';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, FadeInViewDirective, NewExpenseModalComponent],
  templateUrl: './expenses.component.html',
})
export class ExpensesComponent implements OnInit {
  protected ui = inject(UiStateService);
  private toast = inject(ToastService);
  private expenseApi = inject(ExpenseApi);
  private settingsService = inject(SettingsService);
  private cdr = inject(ChangeDetectorRef);

  expenses = signal<Expense[]>([]);
  searchQuery = '';
  selectedDate = '';
  selectedCategory = '';
  selectedType = 'ALL'; // ALL, PERSONAL, GROUP

  selectedExpenseForView = signal<any | null>(null);

  get currencySymbol(): string {
    return this.settingsService.getSymbol();
  }

  ngOnInit(): void {
    this.loadExpenses();
    this.ui.setRefreshCallback(() => this.loadExpenses());
  }

  loadExpenses(): void {
    this.expenseApi.getExpenses(this.searchQuery).subscribe({
      next: (response: any) => {
        let expenseList: Expense[] = Array.isArray(response)
            ? response
            : response.content || response.data || [];

        // Date Filter
        if (this.selectedDate) {
          expenseList = expenseList.filter((item: Expense) => {
            if (!item.createdAt) return false;
            const itemDate = item.createdAt.split('T')[0];
            return itemDate === this.selectedDate;
          });
        }

        // Category Filter
        if (this.selectedCategory && this.selectedCategory !== '') {
          expenseList = expenseList.filter((item: Expense) =>
              item.category?.toLowerCase() === this.selectedCategory.toLowerCase()
          );
        }

        // Personal vs Group Filter
        if (this.selectedType === 'PERSONAL') {
          expenseList = expenseList.filter((item: Expense) => !item.groupId);
        } else if (this.selectedType === 'GROUP') {
          expenseList = expenseList.filter((item: Expense) => !!item.groupId);
        }

        this.expenses.set([...expenseList]);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching expenses:', err);
        this.toast.show('Failed to load expenses', 'error' as any);
      }
    });
  }

  onSearch(): void {
    this.loadExpenses();
  }

  openNewExpenseModal(): void {
    this.ui.openNewExpenseModal();
  }

  editExpense(expense: Expense): void {
    this.ui.openEditExpenseModal(expense);
  }

  deleteExpense(id: string | number | undefined): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseApi.deleteExpense(id).subscribe({
        next: () => {
          this.toast.show('Expense deleted successfully', 'success' as any);
          this.loadExpenses();
        },
        error: (err) => {
          console.error('Error deleting expense:', err);
          this.toast.show('Failed to delete expense', 'error' as any);
        }
      });
    }
  }

  viewExpenseDetails(expense: any): void {
    this.selectedExpenseForView.set(expense);
  }

  closeViewModal(): void {
    this.selectedExpenseForView.set(null);
  }

  exportReport(): void {
    const currentExpenses = this.expenses();
    console.log('Current Expenses for export:', currentExpenses); // 1. Data ရှိမရှိ စစ်ဆေးရန်

    if (!currentExpenses || currentExpenses.length === 0) {
      this.toast.show('No expenses available to export', 'warning' as any);
      return;
    }

    const headers = ['Title', 'Amount', 'Category', 'Payment Method', 'Type', 'Date', 'Notes'];
    const csvRows = [headers.join(',')];

    currentExpenses.forEach(item => {
      const title = `"${(item.title || '').replace(/"/g, '""')}"`;
      const amount = item.amount ?? 0;
      const category = `"${(item.category || 'General').replace(/"/g, '""')}"`;
      const paymentMethod = `"${(item.paymentMethod || 'Cash').replace(/"/g, '""')}"`;
      const type = item.groupId ? 'Group Shared' : 'Personal';
      const date = item.createdAt ? `"${new Date(item.createdAt).toLocaleString()}"` : '""';
      const notes = `"${(item.notes || '').replace(/"/g, '""')}"`;

      csvRows.push([title, amount, category, paymentMethod, type, date, notes].join(','));
    });

    const csvString = csvRows.join('\r\n');
    console.log('Generated CSV String:', csvString);

    const blob = new Blob(['\ufeff' + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `expense_report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);

    this.toast.show('Transaction report exported successfully as CSV!', 'success' as any);
  }

}