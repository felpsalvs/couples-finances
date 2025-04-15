import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addIncome, getIncomes, Income } from '../utils/financeCalculations';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const IncomeScreen = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [source, setSource] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadIncomes();
  }, []);

  const loadIncomes = async () => {
    const loadedIncomes = await getIncomes();
    setIncomes(loadedIncomes);
  };

  const handleSave = async () => {
    if (!description || !amount || !source) {
      // Show error
      return;
    }

    const newIncome: Income = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      date,
      source,
    };

    await addIncome(newIncome);
    setShowAddForm(false);
    setDescription('');
    setAmount('');
    setSource('');
    setDate(new Date());
    loadIncomes();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2)}`;
  };

  const sources = [
    'Salário',
    'Freelance',
    'Investimentos',
    'Vendas',
    'Bonificação',
    'Outros',
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-4 flex-1">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-primary-700">Receitas</Text>
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

        {showAddForm ? (
          <View className="bg-white p-4 rounded-lg mb-4 border border-gray-200">
            <Text className="text-lg font-semibold mb-2">Nova Receita</Text>

            <Text className="text-gray-700 mb-1">Descrição</Text>
            <TextInput
              className="bg-gray-100 p-2 rounded mb-3 border border-gray-300"
              value={description}
              onChangeText={setDescription}
              placeholder="Ex: Salário mensal"
            />

            <Text className="text-gray-700 mb-1">Valor (R$)</Text>
            <TextInput
              className="bg-gray-100 p-2 rounded mb-3 border border-gray-300"
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="numeric"
            />

            <Text className="text-gray-700 mb-1">Fonte</Text>
            <View className="mb-3">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {sources.map((src) => (
                  <TouchableOpacity
                    key={src}
                    className={`mr-2 p-2 rounded-full border ${
                      source === src ? 'bg-primary-100 border-primary-500' : 'border-gray-300'
                    }`}
                    onPress={() => setSource(src)}
                  >
                    <Text className={source === src ? 'text-primary-700' : 'text-gray-700'}>
                      {src}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <Text className="text-gray-700 mb-1">Data de recebimento</Text>
            <TouchableOpacity
              className="bg-gray-100 p-2 rounded mb-3 border border-gray-300 flex-row justify-between items-center"
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{format(date, 'dd/MM/yyyy')}</Text>
              <Ionicons name="calendar" size={20} color="#777" />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <TouchableOpacity
              className="bg-primary-600 p-3 rounded mt-2 items-center"
              onPress={handleSave}
            >
              <Text className="text-white font-semibold">Salvar</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <ScrollView className="flex-1">
          {incomes.length > 0 ? (
            incomes.map((income) => (
              <View
                key={income.id}
                className="bg-white mb-2 p-3 rounded-lg border border-gray-200 flex-row justify-between"
              >
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">{income.description}</Text>
                  <Text className="text-gray-500 text-sm">
                    {format(new Date(income.date), "dd 'de' MMMM", { locale: ptBR })} • {income.source}
                  </Text>
                </View>
                <Text className="text-green-600 font-semibold">
                  {formatCurrency(income.amount)}
                </Text>
              </View>
            ))
          ) : (
            <View className="items-center justify-center mt-10">
              <Ionicons name="wallet-outline" size={60} color="#ccc" />
              <Text className="text-gray-500 mt-2">Nenhuma receita registrada</Text>
              <Text className="text-gray-400 text-sm">Adicione uma nova receita usando o botão +</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default IncomeScreen;