import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MEDIA_BASE_URL } from '@/config';

const EventItem2 = ({ event }) => {
  const router = useRouter();

  const handleEventPress = () => {
    router.push(`/event/${event.id}?title=${event.title}`);
  };

  return (
    <Pressable style={styles.eventCard} onPress={handleEventPress}>
      <Image 
        source={{ uri: `${MEDIA_BASE_URL}${event.picture}` }} 
        style={styles.eventImage}
        onError={(e) => console.log('Event image load error:', e.nativeEvent.error)}
      />
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>{event.name}</Text>
        <Text style={styles.eventDate}>{event.date}</Text>
        <Text style={styles.eventLocation}>{event.place}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 15,
    marginBottom: 10,
    padding: 10,
    width: 300,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2, // Add shadow on Android
    shadowColor: '#000', // Add shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
  },
});

export default EventItem2;
