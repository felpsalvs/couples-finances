import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { addExpense, getExpenses, Expense, deleteExpense } from '../utils/financeCalculations';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { DatePicker } from '../components/ui/DatePicker';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { TransactionItem } from '../components/TransactionItem';

const ExpensesScreen = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errors, setErrors] = useState<{
    description?: string;
    amount?: string;
    category?: string;
  }>({});

  const categories = [
    { label: 'Alimentação', value: 'Alimentação' },
    { label: 'Transporte', value: 'Transporte' },
    { label: 'Moradia', value: 'Moradia' },
    { label: 'Saúde', value: 'Saúde' },
    { label: 'Educação', value: 'Educação' },
    { label: 'Lazer', value: 'Lazer' },
    { label: 'Outros', value: 'Outros' },
  ];

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setIsRefreshing(true);
      const loadedExpenses = await getExpenses();
      // Sort by date (most recent first)
      loadedExpenses.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
      setExpenses(loadedExpenses);
    } catch (error) {
      console.error('Erro ao carregar despesas', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const validateForm = () => {
    const newErrors: {
      description?: string;
      amount?: string;
      category?: string;
    } = {};

    if (!description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!amount) {
      newErrors.amount = 'Valor é obrigatório';
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Valor deve ser um número positivo';
    }

    if (!category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      date,
      category,
    };

    await addExpense(newExpense);
    setShowAddForm(false);
    resetForm();
    loadExpenses();
  };

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory('');
    setDate(new Date());
    setErrors({});
  };

  const handleCancel = () => {
    setShowAddForm(false);
    resetForm();
  };

  const handleRefresh = () => {
    loadExpenses();
  };

  const handleDelete = async (id: string) => {
    await deleteExpense(id);
    loadExpenses();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4 flex-1">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-primary-700">Despesas</Text>
          <TouchableOpacity
            className="bg-primary-600 p-3 rounded-full"
            onPress={() => setShowAddForm(!showAddForm)}
          >
            <Ionicons
              name={showAddForm ? "close" : "add"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {showAddForm && (
          <Card title="Nova Despesa" className="mb-4">
            <Input
              label="Descrição"
              placeholder="Ex: Compras do mês"
              value={description}
              onChangeText={setDescription}
              error={errors.description}
            />

            <Input
              label="Valor (R$)"
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              error={errors.amount}
            />

            <Select
              label="Categoria"
              options={categories}
              value={category}
              onChange={setCategory}
              error={errors.category}
            />

            <DatePicker
              label="Data"
              value={date}
              onChange={setDate}
            />

            <View className="flex-row justify-end space-x-3 mt-4">
              <Button
                title="Cancelar"
                onPress={handleCancel}
                variant="secondary"
              />
              <Button
                title="Salvar"
                onPress={handleSave}
                variant="primary"
              />
            </View>
          </Card>
        )}

        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
        >
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <TransactionItem
                key={expense.id}
                id={expense.id}
                description={expense.description}
                amount={expense.amount}
                date={new Date(expense.date)}
                category={expense.category}
                type="expense"
                onPress={() => handleDelete(expense.id)}
              />
            ))
          ) : (
            <View className="items-center justify-center mt-10">
              <Ionicons name="receipt-outline" size={60} color="#ccc" />
              <Text className="text-gray-500 mt-2">Nenhuma despesa registrada</Text>
              <Text className="text-gray-400 text-sm">Adicione uma nova despesa usando o botão +</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ExpensesScreen;