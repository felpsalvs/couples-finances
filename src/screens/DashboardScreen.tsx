import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinanceContext } from '../hooks/useFinanceContext';
import { Ionicons } from '@expo/vector-icons';

// Componente de cartão resumo
const SummaryCard = ({ title, value, isPositive = true, icon }) => {
  return (
    <View className="bg-card rounded-xl p-4 shadow mb-3">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View className={`w-10 h-10 rounded-full items-center justify-center ${isPositive ? 'bg-success/10' : 'bg-secondary/10'}`}>
            <Ionicons name={icon} size={20} color={isPositive ? '#2ecc71' : '#e74c3c'} />
          </View>
          <Text className="ml-3 text-text-primary font-medium">{title}</Text>
        </View>
        <Text className={`text-lg font-bold ${isPositive ? 'text-success' : 'text-secondary'}`}>
          {value}
        </Text>
      </View>
    </View>
  );
};

// Componente para orçamentos
const BudgetItem = ({ category, allocated, spent, percentUsed }) => {
  // Determina a cor baseada na porcentagem gasta
  const getProgressColor = () => {
    if (percentUsed < 50) return 'bg-success';
    if (percentUsed < 80) return 'bg-warning';
    return 'bg-secondary';
  };

  return (
    <View className="mb-3">
      <View className="flex-row justify-between mb-1">
        <Text className="text-text-primary font-medium">{category}</Text>
        <Text className="text-text-secondary">
          {spent} / {allocated}
        </Text>
      </View>
      <View className="h-2 bg-gray-200 rounded-full w-full">
        <View
          className={`h-2 rounded-full ${getProgressColor()}`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </View>
    </View>
  );
};

// Componente para abas
const TabSelector = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <View className="flex-row bg-background rounded-lg p-1 mb-4">
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => setActiveTab(index)}
          className={`flex-1 py-2 px-4 rounded-md ${activeTab === index ? 'bg-primary' : 'bg-transparent'}`}
        >
          <Text className={`text-center font-medium ${activeTab === index ? 'text-white' : 'text-text-secondary'}`}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Componente principal
const DashboardScreen = () => {
  const { state, calculateFinancialSummary } = useFinanceContext();
  const [activeTab, setActiveTab] = React.useState(0);
  const tabs = ['Conjunto', 'Individual'];

  useEffect(() => {
    calculateFinancialSummary();
  }, []);

  // Formatar valores monetários
  const formatCurrency = (amount: number) => {
    return `R$ ${amount.toFixed(2).replace('.', ',')}`;
  };

  // Mock data para demonstração (substitua pelos dados reais do contexto quando disponíveis)
  const mockSharedSummary = {
    balance: formatCurrency(state?.summary?.sharedBalance || 5400.50),
    income: formatCurrency(state?.summary?.sharedIncome || 8000.00),
    expenses: formatCurrency(state?.summary?.sharedExpenses || 2599.50),
  };

  const mockIndividualSummary = {
    balance: formatCurrency(state?.summary?.personalBalances?.[state?.currentUser?.id]?.balance || 3200.75),
    income: formatCurrency(state?.summary?.personalBalances?.[state?.currentUser?.id]?.income || 4500.00),
    expenses: formatCurrency(state?.summary?.personalBalances?.[state?.currentUser?.id]?.expenses || 1299.25),
  };

  const mockBudgets = [
    { category: 'Moradia', allocated: 'R$ 2000,00', spent: 'R$ 1800,00', percentUsed: 90 },
    { category: 'Alimentação', allocated: 'R$ 1200,00', spent: 'R$ 950,00', percentUsed: 79 },
    { category: 'Transporte', allocated: 'R$ 600,00', spent: 'R$ 480,00', percentUsed: 80 },
    { category: 'Lazer', allocated: 'R$ 500,00', spent: 'R$ 200,00', percentUsed: 40 },
  ];

  const mockPersonalBudgets = [
    { category: 'Assinaturas', allocated: 'R$ 150,00', spent: 'R$ 150,00', percentUsed: 100 },
    { category: 'Roupas', allocated: 'R$ 300,00', spent: 'R$ 120,00', percentUsed: 40 },
    { category: 'Presentes', allocated: 'R$ 200,00', spent: 'R$ 50,00', percentUsed: 25 },
  ];

  // Renderizar o conteúdo baseado na aba ativa
  const renderContent = () => {
    if (activeTab === 0) {
      // Visão Conjunta
      return (
        <>
          <Text className="text-lg text-text-primary font-bold mb-4">Resumo Financeiro Conjunto</Text>
          <SummaryCard title="Saldo Total" value={mockSharedSummary.balance} isPositive={true} icon="wallet-outline" />
          <SummaryCard title="Receitas" value={mockSharedSummary.income} isPositive={true} icon="arrow-up-outline" />
          <SummaryCard title="Despesas" value={mockSharedSummary.expenses} isPositive={false} icon="arrow-down-outline" />

          <Text className="text-lg text-text-primary font-bold mt-6 mb-4">Orçamentos Compartilhados</Text>
          {mockBudgets.map((budget, index) => (
            <BudgetItem key={index} {...budget} />
          ))}
        </>
      );
    } else {
      // Visão Individual
      return (
        <>
          <Text className="text-lg text-text-primary font-bold mb-4">Meu Resumo Financeiro</Text>
          <SummaryCard title="Meu Saldo" value={mockIndividualSummary.balance} isPositive={true} icon="person-outline" />
          <SummaryCard title="Minhas Receitas" value={mockIndividualSummary.income} isPositive={true} icon="arrow-up-outline" />
          <SummaryCard title="Minhas Despesas" value={mockIndividualSummary.expenses} isPositive={false} icon="arrow-down-outline" />

          <Text className="text-lg text-text-primary font-bold mt-6 mb-4">Meus Orçamentos Pessoais</Text>
          {mockPersonalBudgets.map((budget, index) => (
            <BudgetItem key={index} {...budget} />
          ))}
        </>
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 p-4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-text-primary">Dashboard</Text>
          <TouchableOpacity
            className="w-10 h-10 bg-primary rounded-full items-center justify-center"
            onPress={() => calculateFinancialSummary()}
          >
            <Ionicons name="refresh-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <TabSelector tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;