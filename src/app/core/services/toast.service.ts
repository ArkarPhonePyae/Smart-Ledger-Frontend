import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '../../shared/models/toast.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  readonly toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'success'): void {
    const toast: Toast = { id: this.nextId++, message, type };
    this.toasts.update((list) => [...list, toast]);

    // Matches original 3s display + 300ms fade-out removal.
    setTimeout(() => {
      this.dismiss(toast.id);
    }, 3000);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
