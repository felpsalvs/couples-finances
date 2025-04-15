import React from 'react';
import { Text, View } from 'react-native';
import { clsx } from 'clsx';

type MoneyDisplayProps = {
  value: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSign?: boolean;
  colorizeValue?: boolean;
  className?: string;
};

export const MoneyDisplay = ({
  value,
  size = 'md',
  showSign = false,
  colorizeValue = false,
  className,
}: MoneyDisplayProps) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getValueColor = () => {
    if (!colorizeValue) return '';
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-700';
  };

  const getDisplayedValue = () => {
    const formattedValue = formatCurrency(Math.abs(value));
    if (showSign && value > 0) {
      return `+${formattedValue}`;
    }
    if (showSign && value < 0) {
      return `-${formattedValue}`;
    }
    return formattedValue;
  };

  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  return (
    <Text
      className={clsx(
        'font-bold',
        sizeStyles[size],
        getValueColor(),
        className
      )}
    >
      {getDisplayedValue()}
    </Text>
  );
};