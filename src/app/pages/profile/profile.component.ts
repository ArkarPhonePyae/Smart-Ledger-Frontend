import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FadeInViewDirective } from '../../shared/directives/fade-in-view.directive';
import { UserService, UserProfile } from '../../core/services/user';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, FadeInViewDirective],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);

  user: UserProfile | null = null;
  isLoading = true;
  isEditing = false;
  isViewingFriend = false;

  editForm = {
    fullName: '',
    email: '',
    phone: '',
    avatarUrl: '',
    darkMode: false
  };

  ngOnInit(): void {
    const friendId = this.route.snapshot.paramMap.get('id');

    if (friendId) {
      this.isViewingFriend = true;
      this.fetchFriendProfile(friendId);
    } else {
      this.isViewingFriend = false;
      this.fetchProfile();
    }
  }

  fetchProfile(): void {
    this.isLoading = true;
    this.userService.getProfile().subscribe({
      next: (res) => {
        this.user = res.data;
        this.editForm = {
          fullName: res.data.fullName,
          email: res.data.email || '',
          phone: res.data.phone || '',
          avatarUrl: res.data.avatarUrl || '',
          darkMode: res.data.darkMode
        };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load profile', err);
        this.toast.show('Failed to load profile data', 'error' as any);
        this.isLoading = false;
      }
    });
  }

  fetchFriendProfile(id: string): void {
    this.isLoading = true;
    this.userService.getProfileById(id).subscribe({
      next: (res) => {
        this.user = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load friend profile', err);
        this.toast.show('Failed to load friend profile', 'error' as any);
        this.isLoading = false;
      }
    });
  }

  getInitials(name: string | undefined): string {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveProfile(): void {
    this.userService.updateProfile(this.editForm).subscribe({
      next: (res) => {
        this.user = res.data;
        this.isEditing = false;
        this.toast.show('Profile updated successfully!', 'success');
      },
      error: (err) => {
        console.error('Failed to update profile', err);
        this.toast.show('Failed to update profile', 'error' as any);
      }
    });
  }
}