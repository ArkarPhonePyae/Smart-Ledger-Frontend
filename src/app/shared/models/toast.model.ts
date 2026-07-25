export type ToastType = 'success' | 'warning' | 'danger';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}
