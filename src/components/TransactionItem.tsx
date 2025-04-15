import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TransactionItemProps {
  id: string;
  description: string;
  amount: number;
  date: Date;
  category: string;
  type: 'income' | 'expense';
  onPress: (id: string) => void;
}

export const TransactionItem = ({
  id,
  description,
  amount,
  date,
  category,
  type,
  onPress,
}: TransactionItemProps) => {
  const isIncome = type === 'income';
  const amountColor = isIncome ? 'text-emerald-600' : 'text-rose-600';
  const iconName = isIncome ? 'arrow-down-circle' : 'arrow-up-circle';
  const iconColor = isIncome ? '#059669' : '#e11d48';

  const formattedAmount = amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const formattedDate = date.toLocaleDateString('pt-BR');

  return (
    <TouchableOpacity
      onPress={() => onPress(id)}
      className="bg-white px-4 py-3.5 rounded-xl mb-2.5 shadow-sm border border-gray-100/80 active:scale-98 active:bg-gray-50"
    >
      <View className="flex-row justify-between items-center space-x-3">
        <View className="flex-row items-center flex-1 min-w-0">
          <View className="bg-gray-50 rounded-full p-2">
            <Ionicons name={iconName} size={20} color={iconColor} />
          </View>
          <View className="ml-3 flex-1 min-w-0">
            <Text numberOfLines={1} className="font-medium text-gray-900 text-base">
              {description}
            </Text>
            <Text numberOfLines={1} className="text-xs text-gray-500 mt-0.5">
              {category} • {formattedDate}
            </Text>
          </View>
        </View>
        <Text className={`font-semibold text-base ${amountColor}`}>
          {formattedAmount}
        </Text>
      </View>
    </TouchableOpacity>
  );
};