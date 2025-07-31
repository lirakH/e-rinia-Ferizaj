import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  Feather,
} from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const excludedRoutes = [
    'safe',
    'auth/ForgotPassword',
    'auth/LoginScreen',
    'auth/NgoLoginScreen',
    'auth/SignupScreen',
    'event/[id]',
    'event/AddEvent',
    'event/ApproveEvent',    
    'event/index',
    'event/UpdateEvent',
    'NGO/[id]',
    'NGO/AddNgo',
    'NGO/AddMembers',
    'NGO/index',
    'profile/AdminProfileScreen',
    'profile/index',
    'profile/NgoProfileScreen',
    'profile/VolunteerProfileScreen',
    'debug',
  ];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0091F9",
        },
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: "#0091F9" }} />
        ),
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#fff",
        tabBarLabelStyle: {
          fontSize: 12,
        },
        // Navigation bar styling
        navigationBarColor: "#000000",
        navigationBarHidden: false,
        navigationBarStyle: "dark",
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <Feather
              name="home" 
              size={25} 
              color={"#fff"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <Feather
              name="heart" 
              size={25} 
              color={"#fff"}
            />
          ),
        }}
      />
      
      {excludedRoutes.map((route, index) => (
        <Tabs.Screen key={index} name={route} options={{ href: null }} />
      ))}
    </Tabs>
  );
}
