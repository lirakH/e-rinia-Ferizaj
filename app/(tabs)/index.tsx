import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Link } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import EventList from "@/components/EventList.js";
import DraggableCircleGrid from '@/components/DraggableCircleGrid'; // Adjust path as necessary

// Sample data for NGOs
const typeOneNGOs = [
  { id: '1', label: 'NGO One A', image: 'https://via.placeholder.com/150' },
  { id: '2', label: 'NGO One B', image: 'https://via.placeholder.com/150' },
  { id: '3', label: 'NGO One C', image: 'https://via.placeholder.com/150' },
  { id: '4', label: 'NGO One D', image: 'https://via.placeholder.com/150' },
  { id: '5', label: 'NGO One E', image: 'https://via.placeholder.com/150' },
  { id: '6', label: 'NGO One F', image: 'https://via.placeholder.com/150' },
];

const typeTwoNGOs = [
  { id: '1', label: 'NGO Two A', image: 'https://via.placeholder.com/150' },
  { id: '2', label: 'NGO Two B', image: 'https://via.placeholder.com/150' },
  { id: '3', label: 'NGO Two C', image: 'https://via.placeholder.com/150' },
  { id: '4', label: 'NGO Two D', image: 'https://via.placeholder.com/150' },
  { id: '5', label: 'NGO Two E', image: 'https://via.placeholder.com/150' },
  { id: '6', label: 'NGO Two F', image: 'https://via.placeholder.com/150' },
];

const HomeScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.titleContainer}>
        <Text>Activities and Events</Text>
        <Link href="/event" style={styles.link}>
          See All
          <AntDesign name="caretright" size={12} color="#555" />
        </Link>
      </View>
      <EventList />

      <View style={styles.titleContainer}>
        <Text>Activities and Events</Text>
        <Link href="/event" style={styles.link}>
          See All
          <AntDesign name="caretright" size={12} color="#555" />
        </Link>
      </View>
      <DraggableCircleGrid items={typeOneNGOs} />

      <View style={styles.titleContainer}>
        <Text>Activities and Events</Text>
        <Link href="/event" style={styles.link}>
          See All
          <AntDesign name="caretright" size={12} color="#555" />
        </Link>
      </View>
        <DraggableCircleGrid items={typeTwoNGOs} />

        <View>
          
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 30,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ngoContainer: {
    marginBottom: 20,
  },
});

export default HomeScreen;
