import React from 'react';
import { TextInput, View, Text } from 'react-native';
import { clsx } from 'clsx';

type InputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  className?: string;
  disabled?: boolean;
};

export const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  className,
  disabled = false,
}: InputProps) => {
  return (
    <View className="mb-4">
      {label && <Text className="text-gray-700 mb-1 font-medium">{label}</Text>}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={!disabled}
        className={clsx(
          'bg-white border rounded-md p-3',
          error ? 'border-red-500' : 'border-gray-300',
          disabled ? 'bg-gray-100 text-gray-500' : 'bg-white',
          className
        )}
      />
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
};