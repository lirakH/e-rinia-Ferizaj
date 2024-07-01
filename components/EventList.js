import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import EventItem from './EventItem'; // Ensure this path is correct
import { getAllEvents } from '../endpoints'; // Ensure this path is correct

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getAllEvents();
        setEvents(response.data || []); // Ensure response.data is an array
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!Array.isArray(events) || events.length === 0) {
    return (
      <View style={styles.noEventsContainer}>
        <Text>No events available</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, marginLeft: -15 }}>
      <DraggableFlatList
        data={events}
        renderItem={({ item }) => <EventItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        onDragEnd={({ data }) => setEvents(data)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 20, gap: 5 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    marginBottom: 40,
  },
});

export default EventList;
