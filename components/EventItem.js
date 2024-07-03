import React from 'react';
import { Text, Image, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MEDIA_BASE_URL } from '@/config';

const EventItem = ({ item }) => {
  const router = useRouter();

  const handleEventPress = () => {
    router.push(`/event/${item.id}`);
  };

  return (
    <Pressable style={styles.eventCard} onPress={handleEventPress}>
      <Image         
        source={{ uri: `${MEDIA_BASE_URL}${item.picture}` }} 
        style={styles.eventImage} 
        onError={(e) => console.log('Event image load error:', e.nativeEvent.error)}
      />
      <Text style={styles.eventDate}>{item.date}</Text>
      <Text style={styles.eventTitle}>{item.name}</Text>
      <Text style={styles.eventLocation}>{item.place}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 15,
    marginTop: -15,
    marginLeft: -10,
    marginBottom: 10,
    padding: 10,
    width: 200,
    boxShadow: '0 2px 2px rgba(0,0,0,0.2)',
  },
  eventImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  eventDate: {
    fontSize: 12,
    color: '#FF0000',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventLocation: {
    fontSize: 12,
    color: '#666',
  },
});

export default EventItem;
