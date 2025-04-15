import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, subMonths, getMonth, getYear, startOfMonth, addMonths } from 'date-fns';

// Types
export type Expense = {
  id: string;
  description: string;
  amount: number;
  date: Date;
  category: string;
};

export type Income = {
  id: string;
  description: string;
  amount: number;
  date: Date;
  source: string;
};

export type ChartItem = {
  label: string;
  value: number;
};

// Storage Keys
const STORAGE_KEYS = {
  EXPENSES: 'finances_expenses',
  INCOMES: 'finances_incomes',
};

// Expenses Functions
export const getExpenses = async (): Promise<Expense[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (data) {
      const expenses = JSON.parse(data);
      return expenses.map(expense => ({
        ...expense,
        date: new Date(expense.date),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching expenses', error);
    return [];
  }
};

export const addExpense = async (expense: Expense): Promise<void> => {
  try {
    const expenses = await getExpenses();
    expenses.push(expense);
    await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  } catch (error) {
    console.error('Error adding expense', error);
  }
};

export const updateExpense = async (updatedExpense: Expense): Promise<void> => {
  try {
    const expenses = await getExpenses();
    const index = expenses.findIndex(expense => expense.id === updatedExpense.id);
    if (index !== -1) {
      expenses[index] = updatedExpense;
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    }
  } catch (error) {
    console.error('Error updating expense', error);
  }
};

export const deleteExpense = async (id: string): Promise<void> => {
  try {
    const expenses = await getExpenses();
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updatedExpenses));
  } catch (error) {
    console.error('Error deleting expense', error);
  }
};

// Income Functions
export const getIncomes = async (): Promise<Income[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.INCOMES);
    if (data) {
      const incomes = JSON.parse(data);
      return incomes.map(income => ({
        ...income,
        date: new Date(income.date),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching incomes', error);
    return [];
  }
};

export const addIncome = async (income: Income): Promise<void> => {
  try {
    const incomes = await getIncomes();
    incomes.push(income);
    await AsyncStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(incomes));
  } catch (error) {
    console.error('Error adding income', error);
  }
};

export const updateIncome = async (updatedIncome: Income): Promise<void> => {
  try {
    const incomes = await getIncomes();
    const index = incomes.findIndex(income => income.id === updatedIncome.id);
    if (index !== -1) {
      incomes[index] = updatedIncome;
      await AsyncStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(incomes));
    }
  } catch (error) {
    console.error('Error updating income', error);
  }
};

export const deleteIncome = async (id: string): Promise<void> => {
  try {
    const incomes = await getIncomes();
    const updatedIncomes = incomes.filter(income => income.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(updatedIncomes));
  } catch (error) {
    console.error('Error deleting income', error);
  }
};

// Calculation Functions
export const getTotalExpenses = async (): Promise<number> => {
  const expenses = await getExpenses();
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const getTotalIncome = async (): Promise<number> => {
  const incomes = await getIncomes();
  return incomes.reduce((total, income) => total + income.amount, 0);
};

export const getExpensesByCategory = async (): Promise<{[key: string]: number}> => {
  const expenses = await getExpenses();
  return expenses.reduce((categories, expense) => {
    if (!categories[expense.category]) {
      categories[expense.category] = 0;
    }
    categories[expense.category] += expense.amount;
    return categories;
  }, {});
};

export const getIncomesBySource = async (): Promise<{[key: string]: number}> => {
  const incomes = await getIncomes();
  return incomes.reduce((sources, income) => {
    if (!sources[income.source]) {
      sources[income.source] = 0;
    }
    sources[income.source] += income.amount;
    return sources;
  }, {});
};

// Filter by date
const filterByMonth = (items: Array<Expense | Income>, month: number, year: number) => {
  return items.filter(item => {
    const itemDate = new Date(item.date);
    return getMonth(itemDate) === month && getYear(itemDate) === year;
  });
};

// Report Functions
export const getMonthlyTotals = async (period: string): Promise<{ incomes: ChartItem[], expenses: ChartItem[] }> => {
  const allExpenses = await getExpenses();
  const allIncomes = await getIncomes();
  const now = new Date();
  let incomes: ChartItem[] = [];
  let expenses: ChartItem[] = [];

  if (period === 'month') {
    // Data for current month
    const currentMonth = getMonth(now);
    const currentYear = getYear(now);

    const monthExpenses = filterByMonth(allExpenses, currentMonth, currentYear);
    const monthIncomes = filterByMonth(allIncomes, currentMonth, currentYear);

    // Group by category/source
    const expenseCategories = monthExpenses.reduce((acc, expense) => {
      if (!acc[expense.category]) acc[expense.category] = 0;
      acc[expense.category] += expense.amount;
      return acc;
    }, {});

    const incomeSources = monthIncomes.reduce((acc, income) => {
      if (!acc[income.source]) acc[income.source] = 0;
      acc[income.source] += income.amount;
      return acc;
    }, {});

    // Format data for charts
    expenses = Object.keys(expenseCategories).map(category => ({
      label: category,
      value: expenseCategories[category]
    }));

    incomes = Object.keys(incomeSources).map(source => ({
      label: source,
      value: incomeSources[source]
    }));
  } else if (period === 'quarter') {
    // Data for last 3 months
    for (let i = 0; i < 3; i++) {
      const monthDate = subMonths(now, i);
      const monthName = format(monthDate, 'MMM');
      const month = getMonth(monthDate);
      const year = getYear(monthDate);

      const monthExpenses = filterByMonth(allExpenses, month, year);
      const monthIncomes = filterByMonth(allIncomes, month, year);

      const totalExpense = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      const totalIncome = monthIncomes.reduce((sum, income) => sum + income.amount, 0);

      expenses.push({ label: monthName, value: totalExpense });
      incomes.push({ label: monthName, value: totalIncome });
    }

    // Reverse to show chronological order
    expenses.reverse();
    incomes.reverse();
  } else if (period === 'year') {
    // Data for last 12 months grouped by quarter
    const quarters = [
      { label: 'Q1', months: [0, 1, 2] },
      { label: 'Q2', months: [3, 4, 5] },
      { label: 'Q3', months: [6, 7, 8] },
      { label: 'Q4', months: [9, 10, 11] }
    ];

    const currentYear = getYear(now);

    quarters.forEach(quarter => {
      let quarterExpenses = 0;
      let quarterIncomes = 0;

      quarter.months.forEach(month => {
        const monthExpenses = filterByMonth(allExpenses, month, currentYear);
        const monthIncomes = filterByMonth(allIncomes, month, currentYear);

        quarterExpenses += monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        quarterIncomes += monthIncomes.reduce((sum, income) => sum + income.amount, 0);
      });

      expenses.push({ label: quarter.label, value: quarterExpenses });
      incomes.push({ label: quarter.label, value: quarterIncomes });
    });
  }

  return { incomes, expenses };
};

export const getSavingRate = async (period: string): Promise<number> => {
  const { incomes, expenses } = await getMonthlyTotals(period);

  const totalIncome = incomes.reduce((sum, item) => sum + item.value, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.value, 0);

  if (totalIncome === 0) return 0;

  const savings = totalIncome - totalExpenses;
  const savingRate = (savings / totalIncome) * 100;

  return savingRate;
};

// Recent Transactions
export const getRecentTransactions = async (limit = 5): Promise<Array<Income | Expense>> => {
  try {
    const expenses = await getExpenses();
    const incomes = await getIncomes();

    // Combine both arrays
    const allTransactions = [...expenses, ...incomes];

    // Sort by date (most recent first)
    allTransactions.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    // Return only the most recent transactions
    return allTransactions.slice(0, limit);
  } catch (error) {
    console.error('Error getting recent transactions', error);
    return [];
  }
};