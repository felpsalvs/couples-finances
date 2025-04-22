import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Account,
  Category,
  Transaction,
  Budget,
  FinancialSummary
} from '../types/finance';
import { User } from '../types/user';

// Define context state type
interface FinanceState {
  currentUser: User | null;
  partner: User | null;
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  summary: FinancialSummary | null;
  isLoading: boolean;
  error: string | null;
}

// Define available actions
type FinanceAction =
  | { type: 'SET_CURRENT_USER'; payload: User }
  | { type: 'SET_PARTNER'; payload: User | null }
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'UPDATE_ACCOUNT'; payload: Account }
  | { type: 'DELETE_ACCOUNT'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'UPDATE_BUDGET'; payload: Budget }
  | { type: 'DELETE_BUDGET'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CALCULATE_SUMMARY' };

// Define context type
interface FinanceContextType {
  state: FinanceState;
  dispatch: React.Dispatch<FinanceAction>;
  // Utility functions for common operations
  getSharedAccounts: () => Account[];
  getIndividualAccounts: (userId?: string) => Account[];
  getSharedCategories: () => Category[];
  getIndividualCategories: (userId?: string) => Category[];
  getSharedTransactions: () => Transaction[];
  getIndividualTransactions: (userId?: string) => Transaction[];
  calculateFinancialSummary: () => void;
  addAccount: (account: Omit<Account, 'id'>) => Promise<void>;
  updateAccount: (account: Account) => Promise<void>;
  deleteAccount: (accountId: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (transactionId: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
  updateBudget: (budget: Budget) => Promise<void>;
  deleteBudget: (budgetId: string) => Promise<void>;
}

// Initial state
const initialState: FinanceState = {
  currentUser: null,
  partner: null,
  accounts: [],
  categories: [],
  transactions: [],
  budgets: [],
  summary: null,
  isLoading: false,
  error: null,
};

// Create context
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Reducer function
function financeReducer(state: FinanceState, action: FinanceAction): FinanceState {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_PARTNER':
      return { ...state, partner: action.payload };
    case 'ADD_ACCOUNT':
      return { ...state, accounts: [...state.accounts, action.payload] };
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.map(account =>
          account.id === action.payload.id ? action.payload : account
        ),
      };
    case 'DELETE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.filter(account => account.id !== action.payload),
      };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id ? action.payload : category
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
      };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction =>
          transaction.id === action.payload.id ? action.payload : transaction
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id !== action.payload),
      };
    case 'ADD_BUDGET':
      return { ...state, budgets: [...state.budgets, action.payload] };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(budget =>
          budget.id === action.payload.id ? action.payload : budget
        ),
      };
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(budget => budget.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CALCULATE_SUMMARY':
      // This will be implemented in a helper function below
      return state;
    default:
      return state;
  }
}

// Provider component
export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        // Load user data
        const userData = await AsyncStorage.getItem('currentUser');
        if (userData) {
          dispatch({ type: 'SET_CURRENT_USER', payload: JSON.parse(userData) });
        }

        const partnerData = await AsyncStorage.getItem('partner');
        if (partnerData) {
          dispatch({ type: 'SET_PARTNER', payload: JSON.parse(partnerData) });
        }

        // Load financial data
        const accountsData = await AsyncStorage.getItem('accounts');
        const categoriesData = await AsyncStorage.getItem('categories');
        const transactionsData = await AsyncStorage.getItem('transactions');
        const budgetsData = await AsyncStorage.getItem('budgets');

        if (accountsData) {
          const accounts = JSON.parse(accountsData) as Account[];
          accounts.forEach(account => {
            dispatch({ type: 'ADD_ACCOUNT', payload: account });
          });
        }

        if (categoriesData) {
          const categories = JSON.parse(categoriesData) as Category[];
          categories.forEach(category => {
            dispatch({ type: 'ADD_CATEGORY', payload: category });
          });
        }

        if (transactionsData) {
          const transactions = JSON.parse(transactionsData) as Transaction[];
          transactions.forEach(transaction => {
            dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
          });
        }

        if (budgetsData) {
          const budgets = JSON.parse(budgetsData) as Budget[];
          budgets.forEach(budget => {
            dispatch({ type: 'ADD_BUDGET', payload: budget });
          });
        }

        // Calculate summary after loading all data
        calculateFinancialSummary();

      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load financial data' });
        console.error('Error loading data:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadData();
  }, []);

  // Save data to AsyncStorage when state changes
  useEffect(() => {
    const saveData = async () => {
      try {
        if (state.currentUser) {
          await AsyncStorage.setItem('currentUser', JSON.stringify(state.currentUser));
        }

        if (state.partner) {
          await AsyncStorage.setItem('partner', JSON.stringify(state.partner));
        }

        await AsyncStorage.setItem('accounts', JSON.stringify(state.accounts));
        await AsyncStorage.setItem('categories', JSON.stringify(state.categories));
        await AsyncStorage.setItem('transactions', JSON.stringify(state.transactions));
        await AsyncStorage.setItem('budgets', JSON.stringify(state.budgets));
      } catch (error) {
        console.error('Error saving data:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to save financial data' });
      }
    };

    // Skip initial render
    if (state !== initialState) {
      saveData();
    }
  }, [state.accounts, state.categories, state.transactions, state.budgets, state.currentUser, state.partner]);

  // Helper functions
  const getSharedAccounts = () => {
    return state.accounts.filter(account => account.type === 'shared');
  };

  const getIndividualAccounts = (userId?: string) => {
    const id = userId || state.currentUser?.id;
    if (!id) return [];
    return state.accounts.filter(
      account => account.type === 'individual' && account.ownerId === id
    );
  };

  const getSharedCategories = () => {
    return state.categories.filter(category => category.type === 'shared');
  };

  const getIndividualCategories = (userId?: string) => {
    const id = userId || state.currentUser?.id;
    if (!id) return [];
    return state.categories.filter(
      category => category.type === 'individual' && category.ownerId === id
    );
  };

  const getSharedTransactions = () => {
    return state.transactions.filter(transaction => transaction.isShared);
  };

  const getIndividualTransactions = (userId?: string) => {
    const id = userId || state.currentUser?.id;
    if (!id) return [];

    // Get this user's individual accounts
    const userAccountIds = state.accounts
      .filter(account => account.type === 'individual' && account.ownerId === id)
      .map(account => account.id);

    return state.transactions.filter(
      transaction => !transaction.isShared && userAccountIds.includes(transaction.accountId)
    );
  };

  const calculateFinancialSummary = () => {
    if (!state.currentUser) return;

    // Initialize summary structure
    const summary: FinancialSummary = {
      totalBalance: 0,
      totalIncome: 0,
      totalExpenses: 0,
      sharedBalance: 0,
      sharedIncome: 0,
      sharedExpenses: 0,
      personalBalances: {
        [state.currentUser.id]: {
          balance: 0,
          income: 0,
          expenses: 0,
        },
      },
      budgetProgress: {},
    };

    // Add partner to summary if exists
    if (state.partner) {
      summary.personalBalances[state.partner.id] = {
        balance: 0,
        income: 0,
        expenses: 0,
      };
    }

    // Calculate account balances
    state.accounts.forEach(account => {
      if (account.type === 'shared') {
        summary.sharedBalance += account.balance;
      } else if (account.ownerId) {
        if (summary.personalBalances[account.ownerId]) {
          summary.personalBalances[account.ownerId].balance += account.balance;
        }
      }
    });

    // Calculate transaction totals
    state.transactions.forEach(transaction => {
      if (transaction.isShared) {
        if (transaction.type === 'income') {
          summary.sharedIncome += transaction.amount;
        } else {
          summary.sharedExpenses += transaction.amount;
        }
      } else {
        const account = state.accounts.find(a => a.id === transaction.accountId);
        if (account?.ownerId && summary.personalBalances[account.ownerId]) {
          if (transaction.type === 'income') {
            summary.personalBalances[account.ownerId].income += transaction.amount;
          } else {
            summary.personalBalances[account.ownerId].expenses += transaction.amount;
          }
        }
      }
    });

    // Calculate budget progress
    state.budgets.forEach(budget => {
      const categoryTransactions = state.transactions.filter(
        t => t.categoryId === budget.categoryId
      );

      const spent = categoryTransactions.reduce((total, t) => {
        return t.type === 'expense' ? total + t.amount : total;
      }, 0);

      summary.budgetProgress[budget.categoryId] = {
        allocated: budget.amount,
        spent,
        remaining: budget.amount - spent,
        percentUsed: (spent / budget.amount) * 100,
      };
    });

    // Calculate totals
    summary.totalBalance = summary.sharedBalance;
    summary.totalIncome = summary.sharedIncome;
    summary.totalExpenses = summary.sharedExpenses;

    Object.values(summary.personalBalances).forEach(personal => {
      summary.totalBalance += personal.balance;
      summary.totalIncome += personal.income;
      summary.totalExpenses += personal.expenses;
    });

    // Update state
    dispatch({ type: 'CALCULATE_SUMMARY', payload: summary });
  };

  // Helper functions to generate unique IDs (in a real app, use a proper UUID library)
  const generateId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  // CRUD operations
  const addAccount = async (accountData: Omit<Account, 'id'>) => {
    try {
      const newAccount: Account = {
        ...accountData,
        id: generateId(),
      };
      dispatch({ type: 'ADD_ACCOUNT', payload: newAccount });
      calculateFinancialSummary();
    } catch (error) {
      console.error('Error adding account:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add account' });
      throw error;
    }
  };

  const updateAccount = async (account: Account) => {
    try {
      dispatch({ type: 'UPDATE_ACCOUNT', payload: account });
      calculateFinancialSummary();
    } catch (error) {
      console.error('Error updating account:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update account' });
      throw error;
    }
  };

  const deleteAccount = async (accountId: string) => {
    try {
      dispatch({ type: 'DELETE_ACCOUNT', payload: accountId });
      calculateFinancialSummary();
    } catch (error) {
      console.error('Error deleting account:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete account' });
      throw error;
    }
  };

  const addTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction: Transaction = {
        ...transactionData,
        id: generateId(),
      };
      dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
      calculateFinancialSummary();
    } catch (error) {
      console.error('Error adding transaction:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add transaction' });
      throw error;
    }
  };

  const updateTransaction = async (transaction: Transaction) => {
    try {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
      calculateFinancialSummary();
    } catch (error) {
      console.error('Error updating transaction:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update transaction' });
      throw error;
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    try {
      dispatch({ type: 'DELETE_TRANSACTION', payload: transactionId });
      calculateFinancialSummary();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete transaction' });
      throw error;
    }
  };

  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      const newCategory: Category = {
        ...categoryData,
        id: generateId(),
      };
      dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
    } catch (error) {
      console.error('Error adding category:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add category' });
      throw error;
    }
  };

  const updateCategory = async (category: Category) => {
    try {
      dispatch({ type: 'UPDATE_CATEGORY', payload: category });
    } catch (error) {
      console.error('Error updating category:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update category' });
      throw error;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      dispatch({ type: 'DELETE_CATEGORY', payload: categoryId });
    } catch (error) {
      console.error('Error deleting category:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete category' });
      throw error;
    }
  };

  const addBudget = async (budgetData: Omit<Budget, 'id'>) => {
    try {
      const newBudget: Budget = {
        ...budgetData,
        id: generateId(),
      };
      dispatch({ type: 'ADD_BUDGET', payload: newBudget });
      calculateFinancialSummary();
    } catch (error) {
      console.error('Error adding budget:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add budget' });
      throw error;
    }
  };

  const updateBudget = async (budget: Budget) => {
    try {
      dispatch({ type: 'UPDATE_BUDGET', payload: budget });
      calculateFinancialSummary();
    } catch (error) {
      console.error('Error updating budget:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update budget' });
      throw error;
    }
  };

  const deleteBudget = async (budgetId: string) => {
    try {
      dispatch({ type: 'DELETE_BUDGET', payload: budgetId });
      calculateFinancialSummary();
    } catch (error) {
      console.error('Error deleting budget:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete budget' });
      throw error;
    }
  };

  // Context value
  const value: FinanceContextType = {
    state,
    dispatch,
    getSharedAccounts,
    getIndividualAccounts,
    getSharedCategories,
    getIndividualCategories,
    getSharedTransactions,
    getIndividualTransactions,
    calculateFinancialSummary,
    addAccount,
    updateAccount,
    deleteAccount,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    addBudget,
    updateBudget,
    deleteBudget,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

// Hook to use the finance context
export const useFinanceContext = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinanceContext must be used within a FinanceProvider');
  }
  return context;
};

export default useFinanceContext;