import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { clsx } from 'clsx';

type DatePickerProps = {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
};

export const DatePicker = ({
  label,
  value,
  onChange,
  error,
  className,
  disabled = false,
}: DatePickerProps) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View className="mb-4">
      {label && <Text className="text-gray-700 mb-1 font-medium">{label}</Text>}
      <TouchableOpacity
        onPress={() => !disabled && setShowPicker(true)}
        className={clsx(
          'bg-white border rounded-md p-3 flex-row justify-between items-center',
          error ? 'border-red-500' : 'border-gray-300',
          disabled ? 'bg-gray-100 text-gray-500' : 'bg-white',
          className
        )}
      >
        <Text
          className={clsx(
            'text-base',
            disabled ? 'text-gray-500' : 'text-gray-800'
          )}
        >
          {format(value, 'dd/MM/yyyy', { locale: ptBR })}
        </Text>
        <Ionicons name="calendar" size={20} color={disabled ? '#9CA3AF' : '#6B7280'} />
      </TouchableOpacity>
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}

      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};