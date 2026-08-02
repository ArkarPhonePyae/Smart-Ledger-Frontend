import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FadeInViewDirective } from '../../shared/directives/fade-in-view.directive';
import { ToastService } from '../../core/services/toast.service';
import { FriendService, Friend } from '../../core/services/friend';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, FormsModule, FadeInViewDirective],
  templateUrl: './friends.component.html',
})
export class FriendsComponent implements OnInit {
  private friendService = inject(FriendService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  friends: Friend[] = [];
  isLoading = true;
  friendEmail: string = '';

  ngOnInit(): void {
    this.loadFriends();
  }

  loadFriends(): void {
    this.isLoading = true;
    this.friendService.getFriends().subscribe({
      next: (data) => {
        this.friends = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.show('Failed to load friends', 'error' as any);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  addFriend() {
    if (!this.friendEmail || this.friendEmail.trim() === '') {
      this.toast.show('Please enter a friend email', 'error' as any);
      return;
    }

    this.friendService.sendFriendRequest(this.friendEmail).pipe(
        catchError(error => {
          const errorMsg = error.error?.message || error.message || 'Failed to send friend request';
          this.toast.show(errorMsg, 'error' as any);
          return throwError(() => error);
        })
    ).subscribe({
      next: () => {
        this.toast.show('Friend request sent successfully!', 'success' as any);
        this.friendEmail = '';
        this.loadFriends();
      }
    });
  }

  accept(id: string): void {
    this.friendService.acceptRequest(id).subscribe({
      next: () => {
        this.toast.show('Friend request accepted!', 'success' as any);
        this.loadFriends();
      }
    });
  }

  cancelOrUnfriend(id: string, status: string): void {
    const actionName = status === 'REQUEST_SENT' ? 'Cancel request' : 'Delete request';
    this.friendService.removeFriend(id).subscribe({
      next: () => {
        this.toast.show(`${actionName} successful!`, 'success' as any);
        this.loadFriends();
      },
      error: (error) => {
        const errorMsg = error.error?.message || 'Action failed';
        this.toast.show(errorMsg, 'error' as any);
      }
    });
  }

  confirmUnfriend(id: string, name: string): void {
    if (confirm(`Are you sure you want to remove ${name} as a friend?`)) {
      this.friendService.removeFriend(id).subscribe({
        next: () => {
          this.toast.show('Unfriended successfully', 'success' as any);
          this.loadFriends();
        }
      });
    }
  }

  viewProfile(name: string): void {
    this.toast.show(`Viewing profile of ${name}`, 'success' as any);
  }

  messageFriend(name: string): void {
    this.toast.show(`Opening chat with ${name}`, 'success' as any);
  }
}