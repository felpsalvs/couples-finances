import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getMonthlyTotals, getSavingRate, ChartItem } from '../utils/financeCalculations';

type ChartBarProps = {
  label: string;
  value: number;
  maxValue: number;
  color: string;
};

const ChartBar = ({ label, value, maxValue, color }: ChartBarProps) => {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

  return (
    <View className="mb-3">
      <View className="flex-row justify-between mb-1">
        <Text className="text-xs text-gray-600">{label}</Text>
        <Text className="text-xs font-medium">R$ {value.toFixed(2)}</Text>
      </View>
      <View className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
        <View
          className={`h-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </View>
    </View>
  );
};

const SavingRate = ({ rate }: { rate: number }) => {
  let statusColor = 'text-yellow-600';
  let statusText = 'Equilibrado';
  let icon = 'alert-circle';

  if (rate >= 20) {
    statusColor = 'text-green-600';
    statusText = 'Excelente';
    icon = 'checkmark-circle';
  } else if (rate >= 10) {
    statusColor = 'text-blue-600';
    statusText = 'Bom';
    icon = 'thumbs-up';
  } else if (rate < 0) {
    statusColor = 'text-red-600';
    statusText = 'Negativo';
    icon = 'close-circle';
  }

  return (
    <View className="bg-white p-4 rounded-lg mb-4 border border-gray-200">
      <Text className="text-lg font-semibold mb-2">Taxa de Economia</Text>
      <View className="flex-row items-center">
        <Ionicons name={icon} size={24} color={statusColor.replace('text-', '').replace('-600', '')} />
        <Text className={`text-2xl font-bold ml-2 ${statusColor}`}>{rate.toFixed(1)}%</Text>
      </View>
      <Text className="text-gray-600 mt-1">Status: <Text className={statusColor}>{statusText}</Text></Text>
      <Text className="text-gray-500 mt-2 text-xs">
        Recomendação: Tente economizar pelo menos 20% da sua renda.
      </Text>
    </View>
  );
};

const ReportsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [incomeData, setIncomeData] = useState<ChartItem[]>([]);
  const [expensesData, setExpensesData] = useState<ChartItem[]>([]);
  const [savingRate, setSavingRate] = useState(0);

  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  const loadData = async () => {
    const { incomes, expenses } = await getMonthlyTotals(selectedPeriod);
    setIncomeData(incomes);
    setExpensesData(expenses);

    const rate = await getSavingRate(selectedPeriod);
    setSavingRate(rate);
  };

  const getMaxValue = () => {
    const incomeMax = incomeData.length > 0
      ? Math.max(...incomeData.map(item => item.value))
      : 0;
    const expenseMax = expensesData.length > 0
      ? Math.max(...expensesData.map(item => item.value))
      : 0;
    return Math.max(incomeMax, expenseMax);
  };

  const maxValue = getMaxValue();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-4 flex-1">
        <Text className="text-2xl font-bold mb-2 text-primary-700">Relatórios</Text>

        <View className="flex-row bg-gray-100 rounded-lg p-1 mb-4">
          <TouchableOpacity
            className={`flex-1 py-2 rounded-md ${selectedPeriod === 'month' ? 'bg-white shadow' : ''}`}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text className={`text-center ${selectedPeriod === 'month' ? 'text-primary-700 font-medium' : 'text-gray-600'}`}>
              Mês
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 rounded-md ${selectedPeriod === 'quarter' ? 'bg-white shadow' : ''}`}
            onPress={() => setSelectedPeriod('quarter')}
          >
            <Text className={`text-center ${selectedPeriod === 'quarter' ? 'text-primary-700 font-medium' : 'text-gray-600'}`}>
              Trimestre
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 rounded-md ${selectedPeriod === 'year' ? 'bg-white shadow' : ''}`}
            onPress={() => setSelectedPeriod('year')}
          >
            <Text className={`text-center ${selectedPeriod === 'year' ? 'text-primary-700 font-medium' : 'text-gray-600'}`}>
              Ano
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          <SavingRate rate={savingRate} />

          <View className="bg-white p-4 rounded-lg mb-4 border border-gray-200">
            <Text className="text-lg font-semibold mb-4">Receitas vs Despesas</Text>

            <Text className="font-medium mb-2 text-green-600">Receitas</Text>
            {incomeData.length > 0 ? (
              incomeData.map((item, index) => (
                <ChartBar
                  key={`income-${index}`}
                  label={item.label}
                  value={item.value}
                  maxValue={maxValue}
                  color="bg-green-500"
                />
              ))
            ) : (
              <Text className="text-gray-500 mb-4">Nenhuma receita registrada no período</Text>
            )}

            <View className="h-px bg-gray-200 my-4" />

            <Text className="font-medium mb-2 text-red-600">Despesas</Text>
            {expensesData.length > 0 ? (
              expensesData.map((item, index) => (
                <ChartBar
                  key={`expense-${index}`}
                  label={item.label}
                  value={item.value}
                  maxValue={maxValue}
                  color="bg-red-500"
                />
              ))
            ) : (
              <Text className="text-gray-500">Nenhuma despesa registrada no período</Text>
            )}
          </View>

          <View className="bg-white p-4 rounded-lg mb-4 border border-gray-200">
            <Text className="text-lg font-semibold mb-2">Dicas para melhorar</Text>

            <View className="flex-row items-start mb-3">
              <Ionicons name="bulb-outline" size={18} color="#0891b2" className="mt-0.5" />
              <Text className="text-gray-700 ml-2 flex-1">Estabeleça metas claras de economia, como guardar 20% da sua renda mensal</Text>
            </View>

            <View className="flex-row items-start mb-3">
              <Ionicons name="bulb-outline" size={18} color="#0891b2" className="mt-0.5" />
              <Text className="text-gray-700 ml-2 flex-1">Crie um orçamento mensal e siga-o rigorosamente</Text>
            </View>

            <View className="flex-row items-start">
              <Ionicons name="bulb-outline" size={18} color="#0891b2" className="mt-0.5" />
              <Text className="text-gray-700 ml-2 flex-1">Corte gastos desnecessários como assinaturas não utilizadas</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ReportsScreen;