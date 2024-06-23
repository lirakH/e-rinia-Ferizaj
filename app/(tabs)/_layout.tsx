import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  Feather,
  AntDesign,
  MaterialCommunityIcons
} from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0091F9",
        }
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
        name="favourite"
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
      
      <Tabs.Screen name="safe" options={{ href: null }} />
      <Tabs.Screen name="NGO/index" options={{ href: null }} />
      <Tabs.Screen name="NGO/[id]" options={{ href: null }} />
      <Tabs.Screen name="event/index" options={{ href: null }} />
      <Tabs.Screen name="event/[id]" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
