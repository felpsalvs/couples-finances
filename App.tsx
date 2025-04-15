import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/utils/nativewindSetup';

// Import global styles for web
// A importação condicional é tratada durante o bundling
import './global.css';

// Import screens directly
import HomeScreen from './src/screens/HomeScreen';
import ExpensesScreen from './src/screens/ExpensesScreen';
import IncomeScreen from './src/screens/IncomeScreen';
import ReportsScreen from './src/screens/ReportsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap = 'home';

                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Expenses') {
                  iconName = focused ? 'cash' : 'cash-outline';
                } else if (route.name === 'Income') {
                  iconName = focused ? 'wallet' : 'wallet-outline';
                } else if (route.name === 'Reports') {
                  iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#0891b2',
              tabBarInactiveTintColor: 'gray',
              headerShown: false,
            })}
          >
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'Início'
              }}
            />
            <Tab.Screen
              name="Expenses"
              component={ExpensesScreen}
              options={{
                title: 'Despesas'
              }}
            />
            <Tab.Screen
              name="Income"
              component={IncomeScreen}
              options={{
                title: 'Receitas'
              }}
            />
            <Tab.Screen
              name="Reports"
              component={ReportsScreen}
              options={{
                title: 'Relatórios'
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
