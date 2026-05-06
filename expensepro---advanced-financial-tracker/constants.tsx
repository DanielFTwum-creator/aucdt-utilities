
import { Category, Currency } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food & Dining', color: '#EF4444' },
  { id: '2', name: 'Transportation', color: '#F59E0B' },
  { id: '3', name: 'Housing & Utilities', color: '#10B981' },
  { id: '4', name: 'Entertainment', color: '#8B5CF6' },
  { id: '5', name: 'Healthcare', color: '#EC4899' },
  { id: '6', name: 'Shopping', color: '#3B82F6' },
  { id: '7', name: 'Education', color: '#6366F1' },
  { id: '8', name: 'Other', color: '#6B7280' },
];

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1.0 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'JPY', symbol: '¥', rate: 151.34 },
  { code: 'INR', symbol: '₹', rate: 83.34 },
  { code: 'GHS', symbol: 'GH₵', rate: 14.50 },
  { code: 'NGN', symbol: '₦', rate: 1600.00 },
];

export const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'];
