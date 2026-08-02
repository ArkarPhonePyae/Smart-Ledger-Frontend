export interface Expense {
  id?: string | number;
  title: string;
  amount: number | string;
  category?: string; // Optional အဖြစ် ပြောင်းခြင်း
  paymentMethod?: string;
  notes?: string;
  createdAt?: string;
  groupId?: string;
  groupName?: string;

  // UI helper fields
  emoji?: string;
  iconBg?: string;
  iconColor?: string;
  subtitle?: string;
  amountClass?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}