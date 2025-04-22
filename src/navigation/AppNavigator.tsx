import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import AccountsScreen from '../screens/AccountsScreen';
import CategoriesScreen from '../screens/CategoriesScreen';

// Provider
import { FinanceProvider } from '../hooks/useFinanceContext';

const Tab = createBottomTabNavigator();

// Tipos de ícones específicos que sabemos que existem
type IconName = 'home' | 'home-outline' | 'wallet' | 'wallet-outline' | 'list' | 'list-outline';

const AppNavigator = () => {
  return (
    <FinanceProvider>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: IconName = 'home-outline';

            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Contas') {
              iconName = focused ? 'wallet' : 'wallet-outline';
            } else if (route.name === 'Categorias') {
              iconName = focused ? 'list' : 'list-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#3498db',
          tabBarInactiveTintColor: '#7f8c8d',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginBottom: 4,
          },
        })}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Resumo' }}
        />
        <Tab.Screen
          name="Contas"
          component={AccountsScreen}
          options={{ title: 'Contas' }}
        />
        <Tab.Screen
          name="Categorias"
          component={CategoriesScreen}
          options={{ title: 'Categorias' }}
        />
      </Tab.Navigator>
    </FinanceProvider>
  );
};

export default AppNavigator;