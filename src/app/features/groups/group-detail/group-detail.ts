import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GroupService } from '../../../core/services/group-api';
import { Group } from '../../../shared/models/group';
import { ToastService } from '../../../core/services/toast.service';
import { FadeInViewDirective } from '../../../shared/directives/fade-in-view.directive';
import { UiStateService } from '../../../core/services/ui-state.service';
import { NewExpenseModalComponent } from '../../../shared/components/new-expense-modal/new-expense-modal.component';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [CommonModule, FadeInViewDirective, NewExpenseModalComponent],
  templateUrl: './group-detail.html',
})
export class GroupDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private groupService = inject(GroupService);
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  protected ui = inject(UiStateService);
  private cdr = inject(ChangeDetectorRef);

  groupId: string | null = null;
  group: Group | null = null;
  members: any[] = [];
  expenses: any[] = [];
  isLoading = true;
  currentUserEmail: string | null = null;

  ngOnInit(): void {
    this.groupId = this.route.snapshot.paramMap.get('id');
    this.currentUserEmail = localStorage.getItem('user_email') || '';

    if (this.groupId) {
      this.loadGroupDetail(this.groupId);
      this.loadGroupMembers(this.groupId);
      this.loadGroupExpenses(this.groupId);

      this.ui.setRefreshCallback(() => {
        if (this.groupId) this.loadGroupExpenses(this.groupId);
      });
    } else {
      this.toast.show('Invalid Group ID', 'error' as any);
      this.router.navigate(['/groups']);
    }
  }

  loadGroupDetail(id: string): void {
    this.groupService.getGroupById(id).subscribe({
      next: (data) => {
        this.group = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching group detail:', err);
        this.toast.show('Failed to load group details', 'error' as any);
        this.isLoading = false;
        this.router.navigate(['/groups']);
      }
    });
  }

  loadGroupMembers(id: string): void {
    this.http.get<any[]>(`http://localhost:8080/api/groups/${id}/members`).subscribe({
      next: (data) => {
        this.members = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching group members:', err);
      }
    });
  }

  loadGroupExpenses(id: string): void {
    this.http.get<any>(`http://localhost:8080/api/expenses/group/${id}`).subscribe({
      next: (res) => {
        this.expenses = res.data || res || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching group expenses:', err);
        this.expenses = [];
        this.cdr.detectChanges();
      }
    });
  }
  goBack(): void {
    this.router.navigate(['/groups']);
  }

  // ─── EXPENSE MANAGEMENT (MODAL) ───

  openAddExpenseModal(): void {
    if (this.groupId) {
      this.ui.openNewExpenseModalForGroup(this.groupId);
    } else {
      this.ui.openNewExpenseModal();
    }
  }

  leaveGroup(): void {
    if (!this.groupId) return;

    if (confirm('Are you sure you want to leave this group?')) {
      this.groupService.leaveGroup(this.groupId).subscribe({
        next: () => {
          this.toast.show('You have left the group', 'success' as any);
          this.router.navigate(['/groups']);
        },
        error: (err) => {
          if (err.status === 200 || err.statusText === 'OK') {
            this.toast.show('You have left the group', 'success' as any);
            this.router.navigate(['/groups']);
            return;
          }
          console.error('Error leaving group:', err);
          this.toast.show(err.error?.message || 'Failed to leave group', 'error' as any);
        }
      });
    }
  }

  editExpense(exp: any): void {
    this.ui.openEditExpenseModal(exp);
  }

  deleteExpense(expenseId: string): void {
    if (confirm('Are you sure you want to delete this group expense?')) {
      this.http.delete(`http://localhost:8080/api/expenses/${expenseId}`).subscribe({
        next: () => {
          this.toast.show('Expense deleted successfully', 'success' as any);
          if (this.groupId) this.loadGroupExpenses(this.groupId);
        },
        error: (err) => {
          console.error('Error deleting expense:', err);
          this.toast.show('Failed to delete expense', 'error' as any);
        }
      });
    }
  }

  // ─── MEMBER MANAGEMENT ───

  isAdmin(member: any): boolean {
    return member.email === this.group?.createdBy || member.role === 'ADMIN' || member.role === 'ROLE_ADMIN';
  }

  isCurrentUser(member: any): boolean {
    return member.email === this.currentUserEmail;
  }

  openAddMemberModal(): void {
    const email = prompt('Enter member email to add:');
    if (email && this.groupId) {
      this.http.post(`http://localhost:8080/api/groups/${this.groupId}/members`, { email }).subscribe({
        next: () => {
          this.toast.show('Member added successfully', 'success' as any);
          this.loadGroupMembers(this.groupId!);
        },
        error: (err) => {
          console.error('Error adding member:', err);
          this.toast.show(err.error?.message || 'Failed to add member', 'error' as any);
        }
      });
    }
  }

  removeMember(memberId: string): void {
    if (confirm('Are you sure you want to remove this member from the group?')) {
      this.http.delete(`http://localhost:8080/api/groups/${this.groupId}/members/${memberId}`).subscribe({
        next: () => {
          this.toast.show('Member removed successfully', 'success' as any);
          if (this.groupId) this.loadGroupMembers(this.groupId);
        },
        error: (err) => {
          console.error('Error removing member:', err);
          this.toast.show('Failed to remove member', 'error' as any);
        }
      });
    }
  }

}