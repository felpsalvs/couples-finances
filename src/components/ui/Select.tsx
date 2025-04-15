import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { clsx } from 'clsx';

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
};

export const Select = ({
  label,
  options,
  value,
  onChange,
  error,
  className,
  disabled = false,
}: SelectProps) => {
  return (
    <View className="mb-4">
      {label && <Text className="text-gray-700 mb-1 font-medium">{label}</Text>}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row">
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => !disabled && onChange(option.value)}
              className={clsx(
                'mr-2 py-2 px-4 rounded-full border',
                value === option.value
                  ? 'bg-primary-100 border-primary-500'
                  : 'border-gray-300',
                disabled && 'opacity-50'
              )}
              disabled={disabled}
            >
              <Text
                className={clsx(
                  value === option.value ? 'text-primary-700' : 'text-gray-700',
                  'text-sm font-medium'
                )}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
};