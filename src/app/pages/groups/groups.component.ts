import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FadeInViewDirective } from '../../shared/directives/fade-in-view.directive';
import { ToastService } from '../../core/services/toast.service';
import { GroupService } from '../../core/services/group-api';
import { FriendService, Friend } from '../../core/services/friend';
import { Group } from '../../shared/models/group';
import { Router } from "@angular/router";

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, FormsModule, FadeInViewDirective],
  templateUrl: './groups.component.html',
})
export class GroupsComponent implements OnInit {
  private groupService = inject(GroupService);
  private friendService = inject(FriendService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  groups: Group[] = [];
  friends: Friend[] = [];
  isLoading = true;

  // Modal Control States
  showCreateModal = false;
  newGroupName = '';
  newGroupDescription = '';
  selectedMemberIds: string[] = [];

  ngOnInit(): void {
    this.loadGroups();
    this.loadFriends();
  }

  loadGroups(): void {
    this.isLoading = true;
    this.groupService.getGroups().subscribe({
      next: (data) => {
        this.groups = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching groups:', err);
        this.toast.show('Failed to load groups', 'error' as any);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadFriends(): void {
    this.friendService.getFriends().subscribe({
      next: (data) => {
        this.friends = data.filter(f => f.status === 'ACCEPTED' || f.status === 'FRIENDS');
        this.cdr.detectChanges();
      }
    });
  }

  openCreateGroupModal(): void {
    this.newGroupName = '';
    this.newGroupDescription = '';
    this.selectedMemberIds = [];
    this.showCreateModal = true;
  }

  closeCreateGroupModal(): void {
    this.showCreateModal = false;
  }

  toggleMemberSelection(friendId: string | undefined): void {
    if (!friendId) return;
    const index = this.selectedMemberIds.indexOf(friendId);
    if (index > -1) {
      this.selectedMemberIds.splice(index, 1);
    } else {
      this.selectedMemberIds.push(friendId);
    }
  }

  createGroup(): void {
    if (!this.newGroupName || this.newGroupName.trim() === '') {
      this.toast.show('Please enter a group name', 'error' as any);
      return;
    }

    const payload = {
      name: this.newGroupName,
      description: this.newGroupDescription,
      memberIds: this.selectedMemberIds
    };

    this.groupService.createGroup(payload).subscribe({
      next: (created) => {
        this.toast.show('Group created successfully!', 'success' as any);
        this.groups.push(created);
        this.closeCreateGroupModal();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error creating group:', err);
        this.toast.show('Failed to create group', 'error' as any);
      }
    });
  }

  manageGroup(group: Group): void {
    if (!group.id) return;
    this.router.navigate(['/groups', group.id]);
  }

  deleteGroup(id: string): void {
    if (!confirm('Are you sure you want to delete this group?')) return;

    this.groupService.deleteGroup(id).subscribe({
      next: () => {
        this.groups = this.groups.filter(g => g.id !== id);
        this.toast.show('Group deleted successfully', 'success' as any);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error deleting group:', err);
        this.toast.show('Failed to delete group', 'error' as any);
      }
    });
  }
}