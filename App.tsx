import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import QuizScreen from './src/screens/QuizScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CoinsScreen from './src/screens/CoinsScreen';

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName: keyof typeof Ionicons.glyphMap;

                  if (route.name === 'Quiz') {
                    iconName = focused ? 'help-circle' : 'help-circle-outline';
                  } else if (route.name === 'Leaderboard') {
                    iconName = focused ? 'trophy' : 'trophy-outline';
                  } else if (route.name === 'Profile') {
                    iconName = focused ? 'person' : 'person-outline';
                  } else if (route.name === 'Coins') {
                    iconName = focused ? 'diamond' : 'diamond-outline';
                  }

                  return <Ionicons name={iconName!} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#6366F1',
                tabBarInactiveTintColor: 'gray',
                headerStyle: {
                  backgroundColor: '#6366F1',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              })}
            >
              <Tab.Screen 
                name="Quiz" 
                component={QuizScreen}
                options={{ title: 'Quiz' }}
              />
              <Tab.Screen 
                name="Leaderboard" 
                component={LeaderboardScreen}
                options={{ title: 'Classement' }}
              />
              <Tab.Screen 
                name="Profile" 
                component={ProfileScreen}
                options={{ title: 'Profil' }}
              />
              <Tab.Screen 
                name="Coins" 
                component={CoinsScreen}
                options={{ title: 'Coins' }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}