import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FadeInViewDirective } from '../../shared/directives/fade-in-view.directive';

export interface SupportTicket {
  id: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string;
}

export interface SystemUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  active: boolean;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FadeInViewDirective],
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  tickets: SupportTicket[] = [];
  users: SystemUser[] = [];

  metrics = {
    totalUsers: 0,
    totalGroups: 0,
    securityStatus: 'Protected'
  };

  loadingTickets = true;
  loadingUsers = true;

  selectedTicket: SupportTicket | null = null;
  isModalOpen = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchMetrics();
    this.fetchTickets();
    this.fetchUsers();
  }

  fetchMetrics() {
    this.http.get<any>('http://localhost:8080/api/admin/metrics').subscribe({
      next: (data) => {
        this.metrics.totalUsers = data.totalUsers;
        this.metrics.totalGroups = data.totalGroups || 0;
        this.metrics.securityStatus = data.securityStatus || 'Protected';
      },
      error: (err) => console.error('Failed to fetch metrics', err)
    });
  }

  fetchTickets() {
    this.http.get<SupportTicket[]>('http://localhost:8080/api/admin/support-tickets').subscribe({
      next: (data) => {
        this.tickets = data;
        this.loadingTickets = false;
      },
      error: (err) => {
        console.error('Failed to fetch support tickets', err);
        this.loadingTickets = false;
      }
    });
  }

  fetchUsers() {
    this.http.get<SystemUser[]>('http://localhost:8080/api/admin/users').subscribe({
      next: (data) => {
        this.users = data;
        this.loadingUsers = false;
      },
      error: (err) => {
        console.error('Failed to fetch users', err);
        this.loadingUsers = false;
      }
    });
  }

  toggleUserStatus(user: SystemUser) {
    const newStatus = !user.active;
    const actionName = newStatus ? 'Activate' : 'Ban';
    if (confirm(`Are you sure you want to ${actionName} user ${user.fullName}?`)) {
      this.http.put(`http://localhost:8080/api/admin/users/${user.id}/status?active=${newStatus}`, {}).subscribe({
        next: () => {
          user.active = newStatus;
        },
        error: (err) => alert(err.error?.message || 'Failed to update user status')
      });
    }
  }

  deleteTicket(id: string) {
    if (confirm('Are you sure you want to delete this support ticket?')) {
      this.http.delete(`http://localhost:8080/api/admin/support-tickets/${id}`).subscribe({
        next: () => {
          this.tickets = this.tickets.filter(t => t.id !== id);
          this.closeModal();
        },
        error: (err) => alert('Failed to delete support ticket')
      });
    }
  }

  openTicketModal(ticket: SupportTicket) {
    this.selectedTicket = ticket;
    this.isModalOpen = true;
  }

  closeModal() {
    this.selectedTicket = null;
    this.isModalOpen = false;
  }
}