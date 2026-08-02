import { Component, inject, effect, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { UiStateService } from '../../../core/services/ui-state.service';
import { ToastService } from '../../../core/services/toast.service';
import { ExpenseApi } from '../../../core/services/expense-api';
import { GroupService } from '../../../core/services/group-api';
import { Group } from '../../models/group';

@Component({
  selector: 'app-new-expense-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './new-expense-modal.component.html',
})
export class NewExpenseModalComponent implements OnInit {
  protected ui = inject(UiStateService);
  private toast = inject(ToastService);
  private expenseApi = inject(ExpenseApi);
  private groupService = inject(GroupService);
  private cdr = inject(ChangeDetectorRef);

  readonly isOpen = this.ui.isNewExpenseModalOpen;

  id: string | number | null = null;
  title = '';
  amount: number | null = null;
  category = 'General';
  paymentMethod = 'Cash';
  notes = '';
  groupId: string | null = null;
  groups: Group[] = [];

  ngOnInit(): void {
    // Groups list for the optional "share with group" dropdown.
    this.groupService.getGroups().subscribe({
      next: (data) => (this.groups = data),
      error: () => (this.groups = []),
    });
  }

  constructor() {
    effect(() => {
      const data = this.ui.editingExpense();
      if (data) {
        this.id = data.id || data._id || null;
        this.title = data.title || '';
        this.amount = data.amount !== undefined && data.amount !== null ? Number(data.amount) : null;
        this.category = data.category || 'General';
        this.paymentMethod = data.paymentMethod || 'Cash';
        this.notes = data.notes || '';
        this.groupId = data.groupId || null;
      } else {
        this.resetForm();
      }
      this.cdr.detectChanges();
    });
  }

  close(): void {
    this.ui.closeNewExpenseModal();
    this.resetForm();
  }

  submit(): void {
    if (!this.title || this.amount === null || this.amount === undefined) {
      this.toast.show('Please fill in title and amount', 'warning' as any);
      return;
    }

    const payload = {
      title: this.title,
      amount: Number(this.amount),
      category: this.category,
      paymentMethod: this.paymentMethod,
      notes: this.notes,
      groupId: this.groupId || null
    };

    if (this.id) {
      this.expenseApi.updateExpense(this.id, payload).subscribe({
        next: () => {
          this.toast.show('Expense updated successfully!', 'success');
          this.ui.closeNewExpenseModal();
          this.ui.triggerRefresh();
          this.resetForm();
        },
        error: (err) => {
          console.error('Error updating expense:', err);
          this.toast.show('Failed to update expense', 'error' as any);
        }
      });
    } else {
      this.expenseApi.addExpense(payload).subscribe({
        next: () => {
          this.toast.show('Expense added successfully!', 'success');
          this.ui.closeNewExpenseModal();
          this.ui.triggerRefresh();
          this.resetForm();
        },
        error: (err) => {
          console.error('Error adding expense:', err);
          this.toast.show('Failed to add expense', 'error' as any);
        }
      });
    }
  }

  private resetForm(): void {
    this.id = null;
    this.title = '';
    this.amount = null;
    this.category = 'General';
    this.paymentMethod = 'Cash';
    this.notes = '';
    this.groupId = null;
  }
}