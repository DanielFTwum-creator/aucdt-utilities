
export type Category = {
  id: string;
  name: string;
  color: string;
  icon?: string;
};

export type PaymentMethod = 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'Other';

export type Currency = {
  code: string;
  symbol: string;
  rate: number; // Against USD
};

export type Expense = {
  id: string;
  amount: number;
  currency: string;
  date: string;
  categoryId: string;
  paymentMethod: PaymentMethod;
  description: string;
  isRecurring: boolean;
  recurringFrequency?: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  receiptUrl?: string;
  tags: string[];
  createdAt: string;
};

export type Budget = {
  id: string;
  categoryId: string | null; // null for overall budget
  amount: number;
  period: 'Monthly' | 'Yearly';
  startDate: string;
  endDate: string;
};

export type UserProfile = {
  name: string;
  email: string;
  currency: string;
  avatar?: string;
};

export type ThemeType = 'light' | 'dark' | 'high-contrast';

export type AuditEntry = {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  details: string;
};
