import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { clsx } from 'clsx';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
};

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className,
}: ButtonProps) => {
  const baseStyles = 'rounded-md flex-row justify-center items-center';

  const variantStyles = {
    primary: 'bg-primary-600 active:bg-primary-700',
    secondary: 'bg-gray-200 active:bg-gray-300',
    outline: 'border border-primary-600 bg-transparent',
    danger: 'bg-red-600 active:bg-red-700',
  };

  const sizeStyles = {
    sm: 'py-1 px-3',
    md: 'py-2 px-4',
    lg: 'py-3 px-6',
  };

  const textColors = {
    primary: 'text-white',
    secondary: 'text-gray-800',
    outline: 'text-primary-600',
    danger: 'text-white',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        disabled ? 'opacity-50' : '',
        className
      )}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? '#0891b2' : '#fff'}
          className="mr-2"
        />
      ) : null}
      <Text
        className={clsx(
          textColors[variant],
          textSizes[size],
          'font-medium'
        )}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};