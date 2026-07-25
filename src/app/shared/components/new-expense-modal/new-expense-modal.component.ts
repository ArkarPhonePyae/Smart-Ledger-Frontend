import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { UiStateService } from '../../../core/services/ui-state.service';
import { ToastService } from '../../../core/services/toast.service';
import { ExpenseStoreService } from '../../../core/services/expense-store.service';

@Component({
  selector: 'app-new-expense-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './new-expense-modal.component.html',
})
export class NewExpenseModalComponent {
  private ui = inject(UiStateService);
  private toast = inject(ToastService);
  private expenseStore = inject(ExpenseStoreService);

  readonly isOpen = this.ui.isNewExpenseModalOpen;

  description = '';
  amount = '';

  close(): void {
    this.ui.closeNewExpenseModal();
  }

  submit(): void {
    const desc = this.description || 'New Expense';
    const amt = this.amount || '50.00';
    this.toast.show(`Added "$${amt} - ${desc}" successfully!`, 'success');
    this.expenseStore.addExpense(desc, amt);
    this.description = '';
    this.amount = '';
    this.close();
  }
}
