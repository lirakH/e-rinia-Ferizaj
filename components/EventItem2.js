import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MEDIA_BASE_URL } from '@/config';
import { format } from 'date-fns';

const EventItem2 = ({ event }) => {
  const router = useRouter();

  const handleEventPress = () => {
    router.push(`/event/${event.id}?title=${event.title}`);
  };

  // Format the date
  const formattedDate = event.date 
    ? `Data: ${format(new Date(event.date), 'dd-MM-yy')}    Ora: ${format(new Date(event.date), 'HH:mm')}`
    : 'Date not available';

  return (
    <Pressable style={styles.eventCard} onPress={handleEventPress}>
      <Image 
        source={{ uri: `${MEDIA_BASE_URL}${event.picture}` }} 
        style={styles.eventImage}
        onError={(e) => console.log('Event image load error:', e.nativeEvent.error)}
      />
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>{event.name}</Text>
        <Text style={styles.eventDate}>{formattedDate}</Text>
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
    elevation: 2,
    shadowColor: '#000',
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
    fontSize: 13,
    color: '#f00',
  },
  eventLocation: {
    fontSize: 14,
    color: '#000',
  },
});

export default EventItem2;
