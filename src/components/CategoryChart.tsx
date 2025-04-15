import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { VictoryPie } from 'victory-native';

type CategoryData = {
  category: string;
  amount: number;
  color: string;
};

type CategoryChartProps = {
  data: CategoryData[];
  title: string;
};

export const CategoryChart = ({ data, title }: CategoryChartProps) => {
  const width = Dimensions.get('window').width - 50;

  if (!data || data.length === 0) {
    return (
      <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <Text className="text-lg font-bold mb-4">{title}</Text>
        <View className="items-center justify-center p-8">
          <Text className="text-gray-500">Sem dados para exibir</Text>
        </View>
      </View>
    );
  }

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  const chartData = data.map((item) => ({
    x: `${item.category} (${((item.amount / totalAmount) * 100).toFixed(1)}%)`,
    y: item.amount,
    category: item.category,
    color: item.color,
  }));

  return (
    <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <Text className="text-lg font-bold mb-4">{title}</Text>
      <View className="items-center">
        <VictoryPie
          data={chartData}
          width={width}
          height={230}
          colorScale={data.map((item) => item.color)}
          style={{
            labels: {
              fontSize: 12,
              fill: '#374151', // text-gray-700
            },
          }}
          labelRadius={({ radius }) => radius * 0.8}
          innerRadius={50}
          padAngle={2}
        />
      </View>
      <View className="mt-4">
        {data.map((item, index) => (
          <View key={index} className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center">
              <View
                style={{ backgroundColor: item.color }}
                className="w-4 h-4 rounded-full mr-2"
              />
              <Text className="text-gray-700">{item.category}</Text>
            </View>
            <Text className="font-medium">
              R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};