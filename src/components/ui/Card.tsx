import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { clsx } from 'clsx';

type CardProps = {
  children: ReactNode;
  title?: string;
  className?: string;
  variant?: 'default' | 'outline';
};

export const Card = ({
  children,
  title,
  className,
  variant = 'default',
}: CardProps) => {
  return (
    <View
      className={clsx(
        'rounded-lg p-4',
        variant === 'default' ? 'bg-white shadow-sm' : 'border border-gray-200',
        className
      )}
    >
      {title && <Text className="text-lg font-bold mb-2">{title}</Text>}
      {children}
    </View>
  );
};