import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { MoneyDisplay } from './MoneyDisplay';

type StatCardProps = {
  title: string;
  value: number;
  type: 'income' | 'expense' | 'balance';
  icon?: keyof typeof Ionicons.glyphMap;
  className?: string;
};

export const StatCard = ({
  title,
  value,
  type,
  icon,
  className,
}: StatCardProps) => {
  const getBackgroundColor = () => {
    switch (type) {
      case 'income':
        return 'bg-green-100 border-green-500';
      case 'expense':
        return 'bg-red-100 border-red-500';
      case 'balance':
        return value >= 0 ? 'bg-blue-100 border-blue-500' : 'bg-orange-100 border-orange-500';
      default:
        return 'bg-gray-100 border-gray-500';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'income':
        return '#059669'; // green-600
      case 'expense':
        return '#DC2626'; // red-600
      case 'balance':
        return value >= 0 ? '#2563EB' : '#F59E0B'; // blue-600 or amber-500
      default:
        return '#6B7280'; // gray-500
    }
  };

  const getIconName = (): keyof typeof Ionicons.glyphMap => {
    if (icon) return icon;

    switch (type) {
      case 'income':
        return 'arrow-up-circle';
      case 'expense':
        return 'arrow-down-circle';
      case 'balance':
        return value >= 0 ? 'trending-up' : 'trending-down';
      default:
        return 'stats-chart';
    }
  };

  return (
    <View
      className={clsx(
        'p-4 rounded-lg border flex-1',
        getBackgroundColor(),
        className
      )}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-gray-700 font-medium">{title}</Text>
        <Ionicons name={getIconName()} size={24} color={getIconColor()} />
      </View>
      <MoneyDisplay
        value={value}
        size="lg"
        colorizeValue={type === 'balance'}
      />
    </View>
  );
};