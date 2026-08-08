export interface Expense {
  id?: string;
  _id?: string;
  title: string;
  amount: number;
  category: string;
  paymentMethod: string;
  notes?: string;
  groupId?: string | null;
  groupName?: string | null;
  createdAt?: string; // Date and time field
  emoji?: string;
  iconBg?: string;
  iconColor?: string;
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