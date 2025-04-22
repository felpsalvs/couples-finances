import { User } from './user';

export type AccountType = 'shared' | 'individual';
export type TransactionType = 'income' | 'expense';
export type BudgetType = 'shared' | 'individual';

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: AccountType;
  ownerId?: string; // Only for individual accounts
  icon?: string;
  color?: string;
  isVisible: boolean; // Controls visibility to partner
}

export interface Category {
  id: string;
  name: string;
  type: BudgetType;
  icon?: string;
  color?: string;
  ownerId?: string; // For individual categories
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  accountId: string;
  categoryId: string;
  type: TransactionType;
  isShared: boolean;
  paidById?: string; // User ID of who paid (for shared expenses)
  splitRatio?: {
    [userId: string]: number; // e.g., { "user1Id": 0.6, "user2Id": 0.4 } for 60/40 split
  };
  note?: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  currentSpent: number;
  period: 'monthly' | 'weekly' | 'yearly';
  type: BudgetType;
  ownerId?: string; // For individual budgets
}

export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  sharedBalance: number;
  sharedIncome: number;
  sharedExpenses: number;
  personalBalances: {
    [userId: string]: {
      balance: number;
      income: number;
      expenses: number;
    };
  };
  budgetProgress: {
    [categoryId: string]: {
      allocated: number;
      spent: number;
      remaining: number;
      percentUsed: number;
    };
  };
}