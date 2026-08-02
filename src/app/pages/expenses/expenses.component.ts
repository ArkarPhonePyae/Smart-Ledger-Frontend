import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { FadeInViewDirective } from '../../shared/directives/fade-in-view.directive';
import { UiStateService } from '../../core/services/ui-state.service';
import { ToastService } from '../../core/services/toast.service';
import { ExpenseApi } from '../../core/services/expense-api';
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
  private cdr = inject(ChangeDetectorRef);

  expenses = signal<Expense[]>([]);
  searchQuery = '';
  selectedCategory = ''; // 👈 Category အသစ်ထည့်သွင်းခြင်း

  ngOnInit(): void {
    this.loadExpenses();
    this.ui.setRefreshCallback(() => this.loadExpenses());
  }

  loadExpenses(): void {
    // 💡 အကယ်၍ API က category ပါ ပို့ပေးရတယ်ဆိုရင် အောက်ပါအတိုင်း ထည့်နိုင်ပါတယ် (သို့မဟုတ် searchQuery တစ်ခုတည်းသုံးလျှင် မူရင်းအတိုင်းထားနိုင်သည်)
    // ဥပမာ - this.expenseApi.getExpenses(this.searchQuery, this.selectedCategory)

    this.expenseApi.getExpenses(this.searchQuery).subscribe({
      next: (response: any) => {
        let expenseList = Array.isArray(response)
            ? response
            : response.content || response.data || [];

        // 👈 Client-side မှာ Category အလိုက် Filter လုပ်ချင်ပါက ဤကုဒ်ကို သုံးနိုင်သည်
        if (this.selectedCategory && this.selectedCategory !== '') {
          expenseList = expenseList.filter((item: any) =>
              item.category?.toLowerCase() === this.selectedCategory.toLowerCase()
          );
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
          this.toast.show('Expense deleted successfully', 'success');
          this.loadExpenses();
        },
        error: (err) => {
          console.error('Error deleting expense:', err);
          this.toast.show('Failed to delete expense', 'error' as any);
        }
      });
    }
  }

  exportReport(): void {
    this.toast.show('Exporting transaction report...', 'success');
  }
}