import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { getTotalIncome, getTotalExpenses, getRecentTransactions } from '../utils/financeCalculations';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { TransactionItem } from '../components/TransactionItem';

const HomeScreen = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadFinancialData();
    }
  }, [isFocused]);

  const loadFinancialData = async () => {
    try {
      setIsRefreshing(true);
      const income = await getTotalIncome();
      const expenses = await getTotalExpenses();
      const transactions = await getRecentTransactions();

      setTotalIncome(income);
      setTotalExpenses(expenses);
      setRecentTransactions(transactions);
    } catch (error) {
      console.error('Erro ao carregar dados financeiros', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadFinancialData();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <View className="p-4">
          <Text className="text-2xl font-bold mb-2 text-primary-700">Finanças Pessoais</Text>
          <Text className="text-gray-600 mb-6">Resumo financeiro do mês atual</Text>

          <View className="flex-row space-x-3 mb-6">
            <StatCard
              title="Receita"
              value={totalIncome}
              type="income"
            />
            <StatCard
              title="Despesas"
              value={totalExpenses}
              type="expense"
            />
          </View>

          <StatCard
            title="Saldo"
            value={totalIncome - totalExpenses}
            type="balance"
            className="mb-6"
          />

          <Card title="Transações Recentes" className="mb-6">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  id={transaction.id}
                  description={transaction.description}
                  amount={transaction.amount}
                  date={new Date(transaction.date)}
                  category={transaction.category || transaction.source}
                  type={transaction.category ? 'expense' : 'income'}
                />
              ))
            ) : (
              <View className="items-center py-4">
                <Text className="text-gray-500">Nenhuma transação recente</Text>
              </View>
            )}
          </Card>

          <Card title="Dicas" className="mb-6">
            <View className="space-y-2">
              <Text className="text-gray-600">• Adicione suas despesas regulares para melhor controle</Text>
              <Text className="text-gray-600">• Registre receitas assim que recebê-las</Text>
              <Text className="text-gray-600">• Consulte os relatórios para acompanhar sua evolução financeira</Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;