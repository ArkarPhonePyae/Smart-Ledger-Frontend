import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FadeInViewDirective } from '../../shared/directives/fade-in-view.directive';
import { UiStateService } from '../../core/services/ui-state.service';
import { ToastService } from '../../core/services/toast.service';
import { ExpenseStoreService } from '../../core/services/expense-store.service';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FadeInViewDirective],
  templateUrl: './expenses.component.html',
})
export class ExpensesComponent {
  private ui = inject(UiStateService);
  private toast = inject(ToastService);
  private expenseStore = inject(ExpenseStoreService);

  readonly expenses = this.expenseStore.expenses;

  openNewExpenseModal(): void {
    this.ui.openNewExpenseModal();
  }

  exportReport(): void {
    this.toast.show('Exporting transaction report...', 'success');
  }
}
