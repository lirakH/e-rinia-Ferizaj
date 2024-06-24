import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const EventItem = ({ item }) => {
  return (
    <View style={styles.eventCard}>
      <Image source={{ uri: item.image }} style={styles.eventImage} />
      <Text style={styles.eventDate}>{item.date}</Text>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventLocation}>{item.location}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 15, // Increased margin for more space between items
    marginTop: -15,
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
