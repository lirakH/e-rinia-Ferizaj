import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Sample event data
const sampleEvents = [
  {
    id: '1',
    title: 'International Band Music',
    date: '10 June',
    location: '36 Guild Street London, UK',
    image: 'https://via.placeholder.com/150',
    author: 'John Doe',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, nisl nisl aliquet nisl, nec aliquam nisl nisl eget nisl.',
    ngo: 'Music Lovers Foundation',
  },
  {
    id: '2',
    title: 'Jazz',
    date: '10 June',
    location: '36 Guild Street London, UK',
    image: 'https://via.placeholder.com/150',
    author: 'John Doe',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, nisl nisl aliquet nisl, nec aliquam nisl nisl eget nisl.',
    ngo: 'Music Lovers Foundation',
  },
  // Add more sample events as needed
];

export default function Page() {
  const { id } = useLocalSearchParams();

  // Find the event details from the sample data based on the `id`
  const eventDetails = sampleEvents.find((event) => event.id === id);

  return (
    <>
      <Stack.Screen options={{ headerTitle: `Event ${id}` }} />

      {eventDetails ? (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: eventDetails.image }} style={styles.image} />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{eventDetails.title}</Text>
            </View>
          </View>
          <View style={styles.detailsContainer}>
              <TouchableOpacity style={styles.shareButton}>
                <Text>Share</Text>
              </TouchableOpacity>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.date}>{eventDetails.date}</Text>
            </View>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.location}>{eventDetails.location}</Text>
            </View>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.ngoName}>{eventDetails.ngo}</Text>
            </View>
            <Text style={styles.description}>{eventDetails.description}</Text>
          </View>
        </ScrollView>
      ) : (
        <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 20 }}>Event not found</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 10,
  },
  shareButton: {
    backgroundColor: '#0091F9',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    width: 150,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  detailsContainer: {
    padding: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  ngoContainer: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
  },
  ngoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ngoName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ngoDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
});
